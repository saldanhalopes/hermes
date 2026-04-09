import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateRfcDto, RfcStatus, RiskLevel, TransitionRfcDto } from './rfc.dto';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RfcService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  private get collection() {
    return this.firebaseAdmin.firestore().collection('change_requests');
  }

  async create(dto: CreateRfcDto, user: any) {
    const rfcId = `RFC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const newRfc = {
      ...dto,
      id: rfcId,
      tenantId: user.tenantId,
      requesterId: user.uid,
      status: RfcStatus.DRAFT,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.collection.add(newRfc);
    return { firestoreId: docRef.id, ...newRfc };
  }

  async findAll(tenantId: string) {
    const snapshot = await this.collection.where('tenantId', '==', tenantId).get();
    return snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
  }

  async findOne(id: string, tenantId: string) {
    const doc = await this.collection.doc(id).get();
    const data = doc.data();
    if (!doc.exists || !data || data.tenantId !== tenantId) {
      throw new NotFoundException('RFC not found');
    }
    return { firestoreId: doc.id, ...data };
  }

  async transitionStatus(firestoreId: string, dto: TransitionRfcDto, user: any) {
    const rfcRef = this.collection.doc(firestoreId);
    const doc = await rfcRef.get();
    
    if (!doc.exists) {
      throw new NotFoundException('RFC not found');
    }
    
    const rfc = doc.data();
    if (!rfc || rfc.tenantId !== user.tenantId) {
      throw new ForbiddenException('Acesso negado: RFC pertence a outro tenant');
    }

    const currentStatus = rfc.status;
    const targetStatus = dto.status;

    // 1. State Machine Validation
    const allowedTransitions: Record<string, string[]> = {
      [RfcStatus.DRAFT]: [RfcStatus.SUBMITTED],
      [RfcStatus.SUBMITTED]: [RfcStatus.UNDER_EVALUATION],
      [RfcStatus.UNDER_EVALUATION]: [RfcStatus.APPROVED, RfcStatus.REJECTED],
      [RfcStatus.APPROVED]: [RfcStatus.PLANNED],
      [RfcStatus.PLANNED]: [RfcStatus.IMPLEMENTING],
      [RfcStatus.IMPLEMENTING]: [RfcStatus.VERIFICATION, RfcStatus.PLANNED],
      [RfcStatus.VERIFICATION]: [RfcStatus.CLOSED, RfcStatus.REJECTED],
    };

    if (!allowedTransitions[currentStatus]?.includes(targetStatus)) {
      throw new ForbiddenException(`Transition from ${currentStatus} to ${targetStatus} is not allowed.`);
    }

    // 2. Role-Based Access Control (RBAC) per Transition
    const roleRequirements: Partial<Record<RfcStatus, string[]>> = {
      [RfcStatus.SUBMITTED]: ['REQUESTER', 'ADMIN'],
      [RfcStatus.UNDER_EVALUATION]: ['EVALUATOR', 'ADMIN'],
      [RfcStatus.APPROVED]: ['CAB_MEMBER', 'ADMIN'],
      [RfcStatus.REJECTED]: ['CAB_MEMBER', 'EVALUATOR', 'ADMIN'],
      [RfcStatus.PLANNED]: ['IMPLEMENTER', 'ADMIN'],
      [RfcStatus.IMPLEMENTING]: ['IMPLEMENTER', 'ADMIN'],
      [RfcStatus.VERIFICATION]: ['IMPLEMENTER', 'ADMIN'],
      [RfcStatus.CLOSED]: ['AUDITOR', 'ADMIN'],
    };

    if (roleRequirements[targetStatus] && !roleRequirements[targetStatus].includes(user.role)) {
      throw new ForbiddenException(`Role ${user.role} is not authorized for this transition.`);
    }

    // 3. Logic: HIGH risk requires CAB
    if (targetStatus === RfcStatus.APPROVED && rfc.riskLevel === RiskLevel.HIGH && user.role !== 'CAB_MEMBER' && user.role !== 'ADMIN') {
      throw new ForbiddenException('High risk changes must be approved by CAB or Admin');
    }

    // 4. Update the Document
    const updatePayload: any = {
      status: targetStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      [`history_${targetStatus}`]: {
        by: user.uid,
        userName: user.name || 'System',
        at: admin.firestore.FieldValue.serverTimestamp(),
        comment: dto.comment,
        metadata: dto.metadata,
      }
    };

    // Handle Tasks (Action Plan)
    if (dto.tasks) {
      updatePayload.tasks = dto.tasks;
    }

    // Handle Impact Assessment & Recalculate Risk
    if (dto.impactAssessment) {
      updatePayload.impactAssessment = dto.impactAssessment;
      
      const avgScore = dto.impactAssessment.reduce((acc, curr) => acc + curr.score, 0) / dto.impactAssessment.length;
      let newRisk = RiskLevel.LOW;
      if (avgScore >= 4) newRisk = RiskLevel.HIGH;
      else if (avgScore >= 2.5) newRisk = RiskLevel.MEDIUM;
      
      updatePayload.riskLevel = newRisk;
    }

    await rfcRef.update(updatePayload);

    // 5. Trigger Notifications
    this.handleNotifications(firestoreId, targetStatus, rfc, user);

    return { success: true, status: targetStatus, rfcId: rfc.id };
  }

  private async handleNotifications(firestoreId: string, status: RfcStatus, rfc: any, actor: any) {
    const tenantId = actor.tenantId;

    try {
      if (status === RfcStatus.SUBMITTED) {
        // Notify CAB and Admins
        const cabMembers = await this.userService.findByRole('CAB_MEMBER', tenantId);
        const admins = await this.userService.findByRole('ADMIN', tenantId);
        const targets = [...cabMembers, ...admins];

        for (const target of targets) {
          await this.notificationService.create({
            userId: target.uid,
            title: 'Nova RFC Pendente',
            message: `A RFC ${rfc.id} foi submetida e aguarda avaliação.`,
            type: 'RFC_SUBMITTED',
            data: { firestoreId, rfcId: rfc.id },
          });
        }
      } else if (status === RfcStatus.APPROVED || status === RfcStatus.REJECTED) {
        // Notify Requester
        await this.notificationService.create({
          userId: rfc.requesterId,
          title: `RFC ${status === RfcStatus.APPROVED ? 'Aprovada' : 'Rejeitada'}`,
          message: `Sua RFC ${rfc.id} foi ${status === RfcStatus.APPROVED ? 'aprovada' : 'rejeitada'}.`,
          type: `RFC_${status}`,
          data: { firestoreId, rfcId: rfc.id },
        });

        if (status === RfcStatus.APPROVED) {
          // Also notify Implementers
          const implementers = await this.userService.findByRole('IMPLEMENTER', tenantId);
          for (const target of implementers) {
            await this.notificationService.create({
              userId: target.uid,
              title: 'Nova Mudança para Implementar',
              message: `A RFC ${rfc.id} foi aprovada e está pronta para planejamento.`,
              type: 'RFC_ASSIGNED',
              data: { firestoreId, rfcId: rfc.id },
            });
          }
        }
      } else if (status === RfcStatus.CLOSED) {
        // Notify Auditors
        const auditors = await this.userService.findByRole('AUDITOR', tenantId);
        for (const target of auditors) {
          await this.notificationService.create({
            userId: target.uid,
            title: 'RFC Concluída para Auditoria',
            message: `A RFC ${rfc.id} foi fechada e está pronta para revisão final.`,
            type: 'RFC_CLOSED',
            data: { firestoreId, rfcId: rfc.id },
          });
        }
      }
    } catch (error) {
      console.error('Failed to send notifications:', error);
      // Non-blocking error
    }
  }
}

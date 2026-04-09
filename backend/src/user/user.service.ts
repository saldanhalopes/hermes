import { Injectable, Inject, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App
  ) {}

  async findAll(tenantId: string) {
    const snapshot = await this.firebaseAdmin
      .firestore()
      .collection('users')
      .where('tenantId', '==', tenantId)
      .get();

    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    }));
  }

  async findOne(uid: string, tenantId: string) {
    const doc = await this.firebaseAdmin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();

    if (!doc.exists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const data = doc.data();
    if (!data || data.tenantId !== tenantId) {
      throw new ForbiddenException('Acesso negado: Usuário pertence a outro tenant');
    }

    return { uid: doc.id, ...data };
  }

  async create(dto: CreateUserDto, tenantId: string) {
    try {
      // 1. Create in Firebase Auth
      const userRecord = await this.firebaseAdmin.auth().createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.name,
      });

      // 2. Set Custom Claims
      await this.firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {
        tenantId,
        role: dto.role,
      });

      // 3. Save to Firestore
      const userProfile = {
        name: dto.name,
        email: dto.email,
        role: dto.role,
        tenantId,
        active: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await this.firebaseAdmin
        .firestore()
        .collection('users')
        .doc(userRecord.uid)
        .set(userProfile);

      return { uid: userRecord.uid, ...userProfile };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
  }

  async update(uid: string, dto: UpdateUserDto, tenantId: string) {
    const user = await this.findOne(uid, tenantId);

    const updateData: any = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.role) updateData.role = dto.role;
    if (dto.active !== undefined) updateData.active = dto.active;

    // 1. Update Firestore
    await this.firebaseAdmin
      .firestore()
      .collection('users')
      .doc(uid)
      .update(updateData);

    // 2. Update Firebase Auth metadata/claims if needed
    if (dto.name) {
      await this.firebaseAdmin.auth().updateUser(uid, { displayName: dto.name });
    }

    if (dto.role) {
      await this.firebaseAdmin.auth().setCustomUserClaims(uid, {
        tenantId,
        role: dto.role,
      });
    }

    if (dto.active !== undefined) {
      await this.firebaseAdmin.auth().updateUser(uid, { disabled: !dto.active });
    }

    return { ...user, ...updateData };
  }

  async toggleStatus(uid: string, active: boolean, tenantId: string) {
    return this.update(uid, { active }, tenantId);
  }

  async findByRole(role: string, tenantId: string) {
    const snapshot = await this.firebaseAdmin
      .firestore()
      .collection('users')
      .where('tenantId', '==', tenantId)
      .where('role', '==', role)
      .get();

    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    }));
  }
}

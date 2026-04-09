import { Controller, Get, UseGuards, Req, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { FirebaseStoreAuthGuard } from './auth.guard';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(FirebaseStoreAuthGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar logs de auditoria do tenant' })
  async getLogs(@Req() req: any) {
    const { tenantId, role } = req.user;

    // Security check: Only Admin or Auditor
    if (role !== 'ADMIN' && role !== 'AUDITOR') {
        throw new Error('Permissão negada');
    }

    const snapshot = await this.firebaseAdmin
      .firestore()
      .collection('audit_logs')
      .where('tenantId', '==', tenantId)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

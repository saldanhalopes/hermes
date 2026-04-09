import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App
  ) {}

  async registerUser(email: string, password: string, tenantId: string, role: string = 'REQUESTER') {
    try {
      // 1. Create User in Firebase Auth
      const userRecord = await this.firebaseAdmin.auth().createUser({
        email,
        password,
      });

      // 2. Set Custom Claims (tenantId, role)
      await this.firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {
        tenantId,
        role,
      });

      // 3. Create Profile in Firestore
      await this.firebaseAdmin.firestore().collection('users').doc(userRecord.uid).set({
        email,
        tenantId,
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { uid: userRecord.uid, email, tenantId, role };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('O e-mail informado já está em uso.');
      }
      throw error;
    }
  }

  async setClaims(uid: string, tenantId: string, role: string) {
    await this.firebaseAdmin.auth().setCustomUserClaims(uid, { tenantId, role });
    return { success: true };
  }
}

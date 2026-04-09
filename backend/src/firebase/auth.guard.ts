import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStoreAuthGuard implements CanActivate {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid auth header');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(idToken);
      // Attach user info to request
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        tenantId: decodedToken.tenantId, // Injected via Custom Claims
        role: decodedToken.role,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid ID token');
    }
  }
}

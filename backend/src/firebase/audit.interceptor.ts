import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as admin from 'firebase-admin';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body } = request;

    return next.handle().pipe(
      tap(async (response) => {
        if (!user) return; // Skip logs for unauthenticated requests if any

        const log = {
          userId: user.uid,
          tenantId: user.tenantId,
          action: `${method} ${url}`,
          payload: body,
          response: response,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        try {
          await this.firebaseAdmin.firestore().collection('audit_logs').add(log);
        } catch (error) {
          console.error('Audit Log Error:', error);
        }
      }),
    );
  }
}

import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { AuditLogsController } from './audit.controller';
import { FirebaseMock } from './mocks/firebase.mock';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [AuditLogsController],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        const credentialsPath = configService.get<string>('FIREBASE_CREDENTIALS_PATH');
        
        // 1. Try file-based credentials (most stable)
        if (credentialsPath) {
          try {
            if (admin.apps.length === 0) {
              return admin.initializeApp({
                credential: admin.credential.cert(credentialsPath),
              });
            }
            return admin.app();
          } catch (error) {
            console.error(`[FirebaseModule] Failed to load credentials from ${credentialsPath}:`, error.message);
          }
        }

        // 2. Try environment variables
        const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
        const rawKey = configService.get<string>('FIREBASE_PRIVATE_KEY');
        const privateKey = rawKey
          ?.replace(/\\n/g, '\n')
          ?.replace(/"/g, '')
          ?.trim();
        const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');

        if (projectId && privateKey && clientEmail) {
          try {
            if (admin.apps.length === 0) {
              return admin.initializeApp({
                credential: admin.credential.cert({
                  projectId,
                  privateKey,
                  clientEmail,
                }),
              });
            }
            return admin.app();
          } catch (error) {
            console.error('[FirebaseModule] Failed to initialize with env variables:', error.message);
          }
        }

        // 3. Fallback to Mock
        console.warn('⚠️ FIREBASE CREDENTIALS MISSING: Running in Mock Mode');
        return new FirebaseMock() as any;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}

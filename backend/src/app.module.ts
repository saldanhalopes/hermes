import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { RfcModule } from './rfc/rfc.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './firebase/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    AuthModule,
    RfcModule,
    UserModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}

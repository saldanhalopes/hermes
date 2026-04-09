import { Module } from '@nestjs/common';
import { RfcController } from './rfc.controller';
import { RfcService } from './rfc.service';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [NotificationModule, UserModule],
  controllers: [RfcController],
  providers: [RfcService],
})
export class RfcModule {}

import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false })
  data?: any;
}

export class NotificationResponseDto extends CreateNotificationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt: string;
}

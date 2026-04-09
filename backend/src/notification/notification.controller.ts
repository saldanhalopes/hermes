import { Controller, Get, Post, Put, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { FirebaseStoreAuthGuard } from '../firebase/auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(FirebaseStoreAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for the current user' })
  async getMyNotifications(@Request() req) {
    return this.notificationService.findAllByUser(req.user.userId);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for the current user' })
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }
}

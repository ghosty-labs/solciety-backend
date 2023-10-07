import { Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { RequestWithPublicKey } from 'src/profile/profile.entity';
import { NotificationService } from './notification.service';
import { GetNotificationQueryDto } from './notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Put('/')
  async updateHasNotification(@Req() req: RequestWithPublicKey) {
    const publicKey = req.publicKey;
    const hasNotification =
      await this.notificationService.updateHasNotificationByUser(publicKey);

    return hasNotification;
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findNotifications(
    @Req() req: RequestWithPublicKey,
    @Query() query: GetNotificationQueryDto,
  ) {
    const publicKey = req.publicKey;

    const { type, __skip, __limit } = query;

    const skip = parseInt(__skip) || 0;
    const limit = parseInt(__limit) || 30;

    const payload = { publicKey, type };

    const notifications = await this.notificationService.findNotifications(
      payload,
      skip,
      limit,
    );

    return notifications;
  }
}

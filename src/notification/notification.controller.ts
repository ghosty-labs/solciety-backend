import { Controller, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { RequestWithPublicKey } from 'src/profile/profile.entity';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Put('/')
  async updateHasNotification(@Req() req: RequestWithPublicKey) {
    const publicKey = req.publicKey;
    const hasNotification =
      await this.notificationService.updateHasNotification(publicKey);

    return hasNotification;
  }
}

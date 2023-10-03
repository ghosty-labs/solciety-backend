import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDB } from 'schemas/notification.schema';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationDB.name)
    private notificationModel: Model<NotificationDB>,

    private readonly profileService: ProfileService,
  ) {}

  async updateHasNotification(publicKey: string) {
    return await this.profileService.updateHasNotification(publicKey);
  }
}

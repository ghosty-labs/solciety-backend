import { Process, Processor } from '@nestjs/bull';
import {
  CreateNotificationPayloadData,
  NotificationType,
} from '../notification/notification.entity';
import { DoneCallback, Job } from 'bull';
import { FollowUserLogData } from 'src/follow/follow.entity';
import { generatePublicKeyString } from 'utils/generatePublicKey';
import { ProfileService } from 'src/profile/profile.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { mongoWithTransaction } from 'utils/mongoWithTransaction';
import { NotificationService } from 'src/notification/notification.service';

@Processor('NOTIFICATION_QUEUE')
export class NotificationConsumerProcessor {
  constructor(
    @InjectConnection()
    private readonly mongooseConnection: Connection,

    private readonly profileService: ProfileService,
    private readonly notificationService: NotificationService,
  ) {}

  @Process(NotificationType.Follow)
  async followNotification(job: Job, done: DoneCallback) {
    const followData: FollowUserLogData = job.data;

    const fromProfile = await this.profileService.getProfile(followData.user);
    const fromProfileImage = fromProfile.image;

    const payload: CreateNotificationPayloadData = {
      type: NotificationType.Follow,
      key: generatePublicKeyString(),
      user: followData.following,
      from: followData.user,
      icon: fromProfileImage,
      data: {
        url: '/profile',
      },
    };

    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await this.notificationService.createNotification(session, payload);
      await this.profileService.updateHasNotificationToTrue(
        session,
        payload.user,
      );
    });

    done();
  }
}

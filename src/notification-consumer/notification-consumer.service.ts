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
import { LikeData } from 'src/like/like.entity';
import { PostingService } from 'src/posting/posting.service';
import { CommentLogData } from 'src/comment/comment.entity';

@Processor('NOTIFICATION_QUEUE')
export class NotificationConsumerProcessor {
  constructor(
    @InjectConnection()
    private readonly mongooseConnection: Connection,

    private readonly profileService: ProfileService,
    private readonly postingService: PostingService,
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

  @Process(NotificationType.Like)
  async likeNotification(job: Job, done: DoneCallback) {
    const likeData: LikeData = job.data;
    const postPublicKey = likeData.post;

    const [posting, fromProfile] = await Promise.all([
      this.postingService.getPostingByKey(postPublicKey),
      this.profileService.getProfile(likeData.user),
    ]);

    const fromProfileImage = fromProfile.image;

    // Handle like his own posting
    if (likeData.user === posting.user) {
      done();
    }

    const payload: CreateNotificationPayloadData = {
      type: NotificationType.Like,
      key: generatePublicKeyString(),
      user: posting.user,
      from: likeData.user,
      icon: fromProfileImage,
      data: {
        content: posting.content,
        tag: posting.tag,
        post: posting.key,
      },
    };

    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await this.notificationService.createNotification(session, payload);
      await this.profileService.updateHasNotificationToTrue(
        session,
        posting.user,
      );
    });

    done();
  }

  @Process(NotificationType.Comment)
  async commentNotification(job: Job, done: DoneCallback) {
    const commentData: CommentLogData = job.data;

    const [posting, fromProfile] = await Promise.all([
      this.postingService.getPostingByKey(commentData.post),
      this.profileService.getProfile(commentData.user),
    ]);

    const fromProfileImage = fromProfile.image;

    // Handle comment his own posting
    if (commentData.user === posting.user) {
      done();
    }

    const payload: CreateNotificationPayloadData = {
      type: NotificationType.Comment,
      key: generatePublicKeyString(),
      user: posting.user,
      from: commentData.user,
      icon: fromProfileImage,
      data: {
        comment: commentData.content,
        content: posting.content,
        tag: posting.tag,
        post: posting.key,
      },
    };

    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await this.notificationService.createNotification(session, payload);
      await this.profileService.updateHasNotificationToTrue(
        session,
        posting.user,
      );
    });

    done();
  }
}

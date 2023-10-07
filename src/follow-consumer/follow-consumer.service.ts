import { Process, Processor } from '@nestjs/bull';
import { InjectConnection } from '@nestjs/mongoose';
import { DoneCallback, Job } from 'bull';
import { Connection } from 'mongoose';
import {
  FollowJobNameEnum,
  FollowUserLogData,
  UnfollowUserLogData,
} from 'src/follow/follow.entity';
import { FollowService } from 'src/follow/follow.service';
import { ProfileService } from 'src/profile/profile.service';
import { mongoWithTransaction } from 'utils/mongoWithTransaction';

@Processor('FOLLOW_LOGS_INDEXER_WORKER')
export class FollowConsumerService {
  constructor(
    @InjectConnection()
    private readonly mongooseConnection: Connection,

    private readonly profileService: ProfileService,
    private readonly followService: FollowService,
  ) {}

  @Process(FollowJobNameEnum.Follow)
  async followConsumer(job: Job, done: DoneCallback) {
    const followData: FollowUserLogData = job.data;

    const [follower, following] = await Promise.all([
      this.profileService.getProfile(followData.user),
      this.profileService.getProfile(followData.following),
    ]);

    const hasFollowed = await this.followService.getFollowUserAndFollowing(
      followData.user,
      followData.following,
    );
    if (hasFollowed) {
      throw new Error(
        `Account ${followData.user} already followed ${followData.following}`,
      );
    }

    if (follower && following) {
      await mongoWithTransaction(this.mongooseConnection, async (session) => {
        await this.followService.createFollow(session, {
          signature: followData.signature,
          user: followData.user,
          following: followData.following,
        });
        await this.profileService.incrementTotalFollowing(
          session,
          followData.user,
          1,
        );
        await this.profileService.incrementTotalFollower(
          session,
          followData.following,
          1,
        );
      });
    }

    done();
  }

  @Process(FollowJobNameEnum.Unfollow)
  async unfollowConsumer(job: Job, done: DoneCallback) {
    const unfollowData: UnfollowUserLogData = job.data;

    const [follower, following] = await Promise.all([
      this.profileService.getProfile(unfollowData.user),
      this.profileService.getProfile(unfollowData.unfollowing),
    ]);

    if (follower && following) {
      await mongoWithTransaction(this.mongooseConnection, async (session) => {
        await this.followService.deleteFollow(session, {
          user: unfollowData.user,
          following: unfollowData.unfollowing,
        });
        await this.profileService.incrementTotalFollowing(
          session,
          unfollowData.user,
          -1,
        );
        await this.profileService.incrementTotalFollower(
          session,
          unfollowData.unfollowing,
          -1,
        );
      });
    }

    done();
  }
}

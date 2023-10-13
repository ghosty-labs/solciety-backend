import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { Queue } from 'bull';
import { CommentLogData, CommentLogPrefix } from 'src/comment/comment.entity';
import {
  FollowJobNameEnum,
  FollowLogPrefix,
  FollowUserLogData,
  UnfollowUserLogData,
} from 'src/follow/follow.entity';
import { NotificationType } from 'src/notification/notification.entity';
import { PostingLogData, PostingLogPrefix } from 'src/posting/posting.entity';

@Injectable()
export class LogsWorkerService implements OnModuleInit {
  constructor(
    @InjectQueue('POST_LOGS_INDEXER_WORKER')
    private postLogsQueue: Queue,
    @InjectQueue('COMMENT_LOGS_INDEXER_WORKER')
    private commentLogsQueue: Queue,
    @InjectQueue('FOLLOW_LOGS_INDEXER_WORKER')
    private followLogsQueue: Queue,
    @InjectQueue('NOTIFICATION_QUEUE')
    private notificationQueue: Queue,
  ) {}

  async onModuleInit() {
    const WSS_ENDPOINT =
      'wss://aged-cool-shard.solana-devnet.discover.quiknode.pro/63e5d459890844fd35c95e5872eb460332d8f25d/';
    const HTTP_ENDPOINT =
      'https://aged-cool-shard.solana-devnet.discover.quiknode.pro/63e5d459890844fd35c95e5872eb460332d8f25d/';

    const solanaConnection = new Connection(HTTP_ENDPOINT, {
      wsEndpoint: WSS_ENDPOINT,
    });

    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    (async () => {
      const ACCOUNT_TO_WATCH = new PublicKey(
        '6sTexXR4daCeaGPL6dBpaVhadBMjU9fMkpUhSP4MGEEs',
      );
      const subscriptionId = solanaConnection.onLogs(
        ACCOUNT_TO_WATCH,
        async (result) => {
          const logs = result.logs || [];

          const contractLog = logs.find((log) => log.includes('SOLCIETYLOGS'));
          const [key, value] = contractLog.split('::');

          const keyPrefix = key.split('_')[1];

          const stringValue = value.slice(3, -1).replace(/\\n/g, '');
          console.log(key);
          console.log(value);
          console.log(stringValue);
          const objectValue = JSON.parse(stringValue);

          switch (keyPrefix) {
            case PostingLogPrefix.SendPost:
              const postingData: PostingLogData = JSON.parse(objectValue);
              postingData['signature'] = result.signature;

              await this.postLogsQueue.add(postingData);
              break;

            case PostingLogPrefix.UpdatePost:
              //TODO handle
              break;

            case PostingLogPrefix.DeletePost:
              //TODO handle
              break;

            case CommentLogPrefix.SendComment:
              const commentData: CommentLogData = JSON.parse(objectValue);
              commentData['signature'] = result.signature;

              await Promise.all([
                this.commentLogsQueue.add(commentData),
                this.notificationQueue.add(
                  NotificationType.Comment,
                  commentData,
                ),
              ]);
              break;

            case CommentLogPrefix.UpdateComment:
              //TODO handle
              break;

            case CommentLogPrefix.DeleteComment:
              //TODO handle
              break;

            case FollowLogPrefix.FollowUser:
              const followData: FollowUserLogData = JSON.parse(objectValue);
              followData['signature'] = result.signature;

              await Promise.all([
                this.notificationQueue.add(NotificationType.Follow, followData),
                this.followLogsQueue.add(FollowJobNameEnum.Follow, followData),
              ]);
              break;

            case FollowLogPrefix.UnfollowUser:
              const unfollowData: UnfollowUserLogData = JSON.parse(objectValue);
              unfollowData['signature'] = result.signature;

              await this.followLogsQueue.add(
                FollowJobNameEnum.Unfollow,
                unfollowData,
              );
              break;

            default:
              break;
          }
        },
      );
      console.log('Starting web socket, subscription ID: ', subscriptionId);
      await sleep(2000); //Wait 2 seconds for Socket Testing
    })();
  }
}

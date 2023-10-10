import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentDB, CommentSchema } from 'schemas/comment.schema';
import { LikeDB, LikeSchema } from 'schemas/like.schema';
import { PostDB, PostSchema } from 'schemas/post.schema';
import { ProfileDB, ProfileSchema } from 'schemas/profile.schema';
import { FollowModule } from './src/follow/follow.module';
import { FollowConsumerModule } from './src/follow-consumer/follow-consumer.module';
import { FollowDB, FollowSchema } from 'schemas/follow.schema';
import { NotificationModule } from './src/notification/notification.module';
import {
  NotificationDB,
  NotificationSchema,
} from 'schemas/notification.schema';
import { NftService } from './src/nft/nft.service';
import { NftModule } from './src/nft/nft.module';
import { NftDB, NftSchema } from 'schemas/nft.schema';
import { ProfileModule } from 'src/profile/profile.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostDB.name,
        schema: PostSchema,
      },
      {
        name: CommentDB.name,
        schema: CommentSchema,
      },
      {
        name: ProfileDB.name,
        schema: ProfileSchema,
      },
      {
        name: LikeDB.name,
        schema: LikeSchema,
      },
      {
        name: FollowDB.name,
        schema: FollowSchema,
      },
      {
        name: NotificationDB.name,
        schema: NotificationSchema,
      },
      {
        name: NftDB.name,
        schema: NftSchema,
      },
    ]),
    BullModule.registerQueue({ name: 'POST_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'COMMENT_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'FOLLOW_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'NOTIFICATION_QUEUE' }),
    FollowModule,
    FollowConsumerModule,
    NotificationModule,
    ProfileModule,
    NftModule,
  ],
  exports: [MongooseModule, BullModule],
  providers: [NftService],
})
export class GlobalModule {}

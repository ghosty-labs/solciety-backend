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
    ]),
    BullModule.registerQueue({ name: 'POST_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'COMMENT_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'FOLLOW_LOGS_INDEXER_WORKER' }),
    FollowModule,
    FollowConsumerModule,
  ],
  exports: [MongooseModule, BullModule],
})
export class GlobalModule {}

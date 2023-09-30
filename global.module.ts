import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentDB, CommentSchema } from 'schemas/comment.schema';
import { LikeDB, LikeSchema } from 'schemas/like.schema';
import { PostDB, PostSchema } from 'schemas/post.schema';
import { ProfileDB, ProfileSchema } from 'schemas/profile.schema';

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
    ]),
    BullModule.registerQueue({ name: 'POST_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'COMMENT_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'LIKE_LOGS_INDEXER_WORKER' }),
  ],
  exports: [MongooseModule, BullModule],
})
export class GlobalModule {}

import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostDB, PostSchema } from 'schemas/post.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostDB.name,
        schema: PostSchema,
      },
    ]),
    BullModule.registerQueue({ name: 'POST_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'COMMENT_LOGS_INDEXER_WORKER' }),
    BullModule.registerQueue({ name: 'LIKE_LOGS_INDEXER_WORKER' }),
  ],
  exports: [MongooseModule, BullModule],
})
export class GlobalModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsWorkerModule } from './logs-worker/logs-worker.module';
import { PostingModule } from './posting/posting.module';
import { CommentModule } from './comment/comment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalModule } from 'global.module';
import { BullModule } from '@nestjs/bull';
import { PostingConsumerModule } from './posting-consumer/posting-consumer.module';
import { CommentConsumerModule } from './comment-consumer/comment-consumer.module';

@Module({
  imports: [
    GlobalModule,
    BullModule.forRoot({
      url: 'redis://:@0.0.0.0:6379',
    }),
    MongooseModule.forRoot(
      'mongodb+srv://wahdanaedo:yw3MMTWHSdxLxoAX@cluster0.srr7czq.mongodb.net/solciety',
    ),
    LogsWorkerModule,
    PostingConsumerModule,
    CommentConsumerModule,
    PostingModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LogsWorkerModule } from './logs-worker/logs-worker.module';
import { PostingModule } from './posting/posting.module';
import { CommentModule } from './comment/comment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalModule } from 'global.module';
import { BullModule } from '@nestjs/bull';
import { PostingConsumerModule } from './posting-consumer/posting-consumer.module';
import { CommentConsumerModule } from './comment-consumer/comment-consumer.module';
import { ProfileModule } from './profile/profile.module';
import { LikeModule } from './like/like.module';
import { AuthMiddleware } from './posting/posting.middleware';
import { FollowConsumerModule } from './follow-consumer/follow-consumer.module';
import { NotificationConsumerModule } from './notification-consumer/notification-consumer.module';
import { NotificationModule } from './notification/notification.module';

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
    FollowConsumerModule,
    NotificationConsumerModule,
    PostingModule,
    CommentModule,
    ProfileModule,
    LikeModule,
    NotificationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'posting', method: RequestMethod.GET },
        { path: 'profile', method: RequestMethod.GET },
        { path: 'like', method: RequestMethod.GET },
      );
  }
}

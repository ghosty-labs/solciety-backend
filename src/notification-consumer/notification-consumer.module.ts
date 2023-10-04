import { Module } from '@nestjs/common';
import { NotificationConsumerProcessor } from './notification-consumer.service';
import { ProfileModule } from 'src/profile/profile.module';
import { NotificationModule } from 'src/notification/notification.module';
import { PostingModule } from 'src/posting/posting.module';

@Module({
  imports: [ProfileModule, PostingModule, NotificationModule],
  providers: [NotificationConsumerProcessor],
  exports: [NotificationConsumerProcessor],
})
export class NotificationConsumerModule {}

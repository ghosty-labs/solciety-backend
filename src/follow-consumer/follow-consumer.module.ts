import { Module } from '@nestjs/common';
import { FollowConsumerService } from './follow-consumer.service';
import { ProfileModule } from 'src/profile/profile.module';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports: [ProfileModule, FollowModule],
  providers: [FollowConsumerService],
})
export class FollowConsumerModule {}

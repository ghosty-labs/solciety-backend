import { Module } from '@nestjs/common';
import { PostingModule } from 'src/posting/posting.module';
import { PostingConsumerProcessor } from './posting-consumer.service';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [PostingModule, ProfileModule],
  providers: [PostingConsumerProcessor],
  exports: [PostingConsumerProcessor],
})
export class PostingConsumerModule {}

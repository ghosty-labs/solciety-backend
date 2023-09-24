import { Module } from '@nestjs/common';
import { PostingModule } from 'src/posting/posting.module';
import { PostingConsumerProcessor } from './posting-consumer.service';

@Module({
  imports: [PostingModule],
  providers: [PostingConsumerProcessor],
  exports: [PostingConsumerProcessor],
})
export class PostingConsumerModule {}

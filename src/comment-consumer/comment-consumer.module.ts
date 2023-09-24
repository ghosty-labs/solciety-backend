import { Module } from '@nestjs/common';
import { CommentModule } from 'src/comment/comment.module';
import { CommentConsumerProcessor } from './comment-consumer.service';

@Module({
  imports: [CommentModule],
  providers: [CommentConsumerProcessor],
  exports: [CommentConsumerProcessor],
})
export class CommentConsumerModule {}

import { Module } from '@nestjs/common';
import { PostingService } from './posting.service';
import { PostingController } from './posting.controller';

@Module({
  providers: [PostingService],
  controllers: [PostingController],
  exports: [PostingService],
})
export class PostingModule {}

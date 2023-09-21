import { Module } from '@nestjs/common';
import { PostWorkerService } from './post-worker.service';
import { PostingModule } from 'src/posting/posting.module';

@Module({
  imports: [PostingModule],
  providers: [PostWorkerService],
})
export class PostWorkerModule {}

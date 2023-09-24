import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { PostingLogData } from 'src/posting/posting.entity';
import { PostingService } from 'src/posting/posting.service';

@Processor('POST_LOGS_INDEXER_WORKER')
export class PostingConsumerProcessor {
  constructor(private readonly postingService: PostingService) {}

  @Process()
  async postingConsumer(job: Job, done: DoneCallback) {
    const postingData: PostingLogData = job.data;

    const posting = await this.postingService.getPostingBySignature(
      postingData.signature,
    );

    if (!posting) {
      await this.postingService.createPosting(postingData);
    }

    done();
  }
}

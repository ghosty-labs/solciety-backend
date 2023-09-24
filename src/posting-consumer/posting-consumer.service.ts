import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { PostingLogData } from 'src/posting/posting.entity';
import { PostingService } from 'src/posting/posting.service';

@Processor('POST_LOGS_INDEXER_WORKER')
export class PostingConsumerProcessor {
  constructor(private readonly postingService: PostingService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @Process()
  async postingConsumer(job: Job, done: DoneCallback) {
    console.log('JOB DATA : ', job);
    const postingData: PostingLogData = job.data;

    const posting = await this.postingService.getPostingBySignature(
      postingData.signature,
    );
    console.log('POSTING EXIST', posting);

    if (!posting) {
      console.log('IF NOT EXIST');
      await this.postingService.createPosting(postingData);
    }

    done();
  }
}

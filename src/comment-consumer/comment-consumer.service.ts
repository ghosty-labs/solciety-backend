import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { CommentLogData } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';

@Processor('COMMENT_LOGS_INDEXER_WORKER')
export class CommentConsumerProcessor {
  constructor(private readonly commentService: CommentService) {}

  @Process()
  async commentConsumer(job: Job, done: DoneCallback) {
    const commentData: CommentLogData = job.data;

    const comment = await this.commentService.getCommentBySignature(
      commentData.signature,
    );

    if (!comment) {
      await this.commentService.createComment(commentData);
    }

    done();
  }
}

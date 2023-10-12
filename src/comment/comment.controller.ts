import { Controller, Get, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { GetCommentQueryDto } from './comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/')
  async findComments(@Query() query: GetCommentQueryDto) {
    const { __skip, __limit } = query;

    const skip = parseInt(__skip) || 0;
    const limit = parseInt(__limit) || 50;

    const payload = {
      user: query.user,
      post: query.post,
      parent: query.parent,
      lookupPost: query.__lookup_post,
    };

    const posting = await this.commentService.findComments(
      payload,
      skip,
      limit,
    );

    return posting;
  }
}

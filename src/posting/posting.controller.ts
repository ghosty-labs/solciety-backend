import { Controller, Get, Query } from '@nestjs/common';
import { PostingService } from './posting.service';
import { GetPostingQueryDto } from './posting.dto';

@Controller('posting')
export class PostingController {
  constructor(private readonly postingService: PostingService) {}

  @Get('/')
  async findPosting(@Query() query: GetPostingQueryDto) {
    const { __skip, __limit } = query;

    const skip = parseInt(__skip) || 0;
    const limit = parseInt(__limit) || 50;

    const payload = {
      user: query.user,
      tag: query.tag,
      search: query.search,
    };

    const posting = await this.postingService.findPosting(payload, skip, limit);

    return posting;
  }
}

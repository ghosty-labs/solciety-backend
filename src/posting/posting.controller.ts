import { Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PostingService } from './posting.service';
import { GetNewPostStatusQueryDto, GetPostingQueryDto } from './posting.dto';
import { ProfileService } from 'src/profile/profile.service';
import { AuthGuard } from 'guards/auth.guard';
import { RequestWithPublicKey } from 'src/profile/profile.entity';

@Controller('posting')
export class PostingController {
  constructor(
    private readonly postingService: PostingService,
    private readonly profileService: ProfileService,
  ) {}

  @Get('/')
  async findPosting(
    @Req() req: RequestWithPublicKey,
    @Query() query: GetPostingQueryDto,
  ) {
    const { __skip, __limit } = query;

    const skip = parseInt(__skip) || 0;
    const limit = parseInt(__limit) || 50;

    const payload = {
      key: query.key,
      user: query.user,
      tag: query.tag,
      search: query.search,
      likedBy: req.publicKey,
    };

    const posting = await this.postingService.findPosting(payload, skip, limit);

    return posting;
  }

  @Get('/new-post-status')
  async getNewPostStatus(@Query() query: GetNewPostStatusQueryDto) {
    const publicKey = query.public_key;
    return await this.profileService.getNewPostingStatus(publicKey);
  }

  @UseGuards(AuthGuard)
  @Put('/new-post-status')
  async setNewPostStatus(@Req() req: RequestWithPublicKey) {
    const publicKey = req.publicKey;
    return await this.profileService.updateHasNewPostByPublicKey(publicKey);
  }
}

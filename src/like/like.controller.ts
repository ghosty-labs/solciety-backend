import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { LikePostBodyDto } from 'src/posting/posting.dto';
import { RequestWithPublicKey } from 'src/profile/profile.entity';
import { LikeService } from './like.service';
import { GetLikeQueryDto } from './like.dto';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get('/like')
  async findLikes(
    @Req() req: RequestWithPublicKey,
    @Query() query: GetLikeQueryDto,
  ) {
    const { __skip, __limit } = query;

    const skip = parseInt(__skip) || 0;
    const limit = parseInt(__limit) || 50;

    const payload = {
      user: query.user,
      likedBy: req.publicKey,
    };

    const likes = await this.likeService.findLikes(payload, skip, limit);
    return likes;
  }

  @UseGuards(AuthGuard)
  @Put('/like/posting')
  async likePosting(
    @Req() req: RequestWithPublicKey,
    @Body() body: LikePostBodyDto,
  ) {
    const publicKey = req.publicKey;
    const postPublicKey = body.post;

    return await this.likeService.createLike(publicKey, postPublicKey);
  }

  @UseGuards(AuthGuard)
  @Put('/unlike/posting')
  async unlikePosting(
    @Req() req: RequestWithPublicKey,
    @Body() body: LikePostBodyDto,
  ) {
    const publicKey = req.publicKey;
    const postPublicKey = body.post;

    return await this.likeService.deleteLike(publicKey, postPublicKey);
  }
}

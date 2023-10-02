import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { LikePostBodyDto } from 'src/posting/posting.dto';
import { RequestWithPublicKey } from 'src/profile/profile.entity';
import { LikeService } from './like.service';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

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

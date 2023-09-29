import { Controller, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';

@Controller('like')
export class LikeController {
  constructor() {}

  @UseGuards(AuthGuard)
  @Put('/posting')
  async likePosting() {}
}

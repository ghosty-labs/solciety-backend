import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GetProfileQueryDto, PutProfileBodyDto } from './profile.dto';
import { PutProfilePayload, RequestWithPublicKey } from './profile.entity';
import { AuthGuard } from 'guards/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Put('/')
  async putProfile(
    @Req() req: RequestWithPublicKey,
    @Body() body: PutProfileBodyDto,
  ) {
    const publicKey = req.publicKey;
    const profilePayload: PutProfilePayload = {
      alias: body.alias,
      bio: body.bio,
    };

    const profile = await this.profileService.updateOrCreateProfile(
      publicKey,
      profilePayload,
    );
    return profile;
  }

  @Get('/')
  async getProfile(@Query() query: GetProfileQueryDto) {
    const publicKey = query.public_key;
    const profile = await this.profileService.getProfile(publicKey);

    return profile;
  }
}

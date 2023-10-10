import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { RequestWithPublicKey } from 'src/profile/profile.entity';
import { GetNftQueryDto, PostNftBodyDto } from './nft.dto';
import { NftService } from './nft.service';
import { NftPostPayloadData } from './nft.entity';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('/')
  async findNfts(@Query() query: GetNftQueryDto) {
    const { user, __skip, __limit } = query;

    const skip = parseInt(__skip) || 0;
    const limit = parseInt(__limit) || 50;

    const nfts = await this.nftService.findNfts(user, skip, limit);

    return nfts;
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async createNft(
    @Req() req: RequestWithPublicKey,
    @Body() body: PostNftBodyDto,
  ) {
    const {
      signature,
      name,
      uri,
      mint_address,
      collection_address,
      token_address,
    } = body;

    const payload: NftPostPayloadData = {
      signature,
      name,
      uri,
      mintAddress: mint_address,
      collectionAddress: collection_address,
      tokenAddress: token_address,
    };

    const result = await this.nftService.createNft(req.publicKey, payload);

    return result;
  }
}

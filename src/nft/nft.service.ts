import { Injectable } from '@nestjs/common';
import { CreateNftPayloadData, NftPostPayloadData } from './nft.entity';
import { ProfileService } from 'src/profile/profile.service';
import { fetchMetadata } from 'utils/fetchMetadata';
import { InjectModel } from '@nestjs/mongoose';
import { NftDB, NftDocument } from 'schemas/nft.schema';
import { Model } from 'mongoose';
import { Connection } from '@solana/web3.js';

@Injectable()
export class NftService {
  constructor(
    @InjectModel(NftDB.name)
    private nftModel: Model<NftDocument>,

    private readonly profileService: ProfileService,
  ) {}

  async findNfts(user: string, skip: number, limit: number) {
    const aggregations = [];

    aggregations.push({ $match: { user } });
    aggregations.push({ $sort: { created_at: -1 } });

    const aggregationMatches = [...aggregations];

    aggregations.push({ $skip: skip });
    aggregations.push({ $limit: limit });

    const [nfts, total] = await Promise.all([
      this.nftModel.aggregate(aggregations),
      this.nftModel.aggregate(aggregationMatches.concat([{ $count: 'count' }])),
    ]);

    return {
      results: nfts,
      total: total[0]?.count || 0,
      skip,
      limit,
    };
  }

  async createNft(user: string, data: NftPostPayloadData) {
    const profileExist = await this.profileService.checkProfileExist(user);
    if (!profileExist) throw new Error(`Profile not found`);

    // TODO move this to global variable
    const HTTP_ENDPOINT =
      'https://aged-cool-shard.solana-devnet.discover.quiknode.pro/63e5d459890844fd35c95e5872eb460332d8f25d/';
    const solanaConnection = new Connection(HTTP_ENDPOINT);
    const confirmation = await solanaConnection.getSignatureStatus(
      data.signature,
      { searchTransactionHistory: true },
    );
    if (confirmation.value.confirmationStatus !== 'finalized') {
      throw new Error(`signature is not finalized`);
    }

    const metadata = await fetchMetadata(data.uri);
    const payload: CreateNftPayloadData = {
      user,
      signature: data.signature,
      candy_machine_id: 'HhYpUYjen5d3Kedw92Hag69nNnVCQ6XUCweVekrewGtN ', // TODO hardcoded
      mint_address: data.mintAddress,
      collection_address: data.collectionAddress,
      token_address: data.tokenAddress,
      name: data.name,
      description: metadata.description,
      image: metadata.image,
      attributes: metadata.attributes,
      symbol: metadata.symbol,
    };

    return await this.nftModel.findOneAndUpdate(
      {
        token_address: payload.token_address,
        mint_address: payload.mint_address,
      },
      { $set: payload },
      { upsert: true, returnDocument: 'after' },
    );
  }
}

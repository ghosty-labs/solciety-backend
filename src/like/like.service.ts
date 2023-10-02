import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { LikeDB, LikeDocument } from 'schemas/like.schema';
import { mongoWithTransaction } from 'utils/mongoWithTransaction';
import { PostingService } from 'src/posting/posting.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(LikeDB.name)
    private likeModel: Model<LikeDocument>,

    @InjectConnection()
    private readonly mongooseConnection: Connection,

    private readonly postingService: PostingService,
  ) {}

  async createLike(publicKey: string, postPublicKey: string) {
    const like = await this.likeModel.findOne({
      user: publicKey,
      post: postPublicKey,
    });

    if (like)
      throw new BadRequestException(`error: you already liked this post`);

    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await new this.likeModel<LikeDB>({
        user: publicKey,
        post: postPublicKey,
      }).save({ session });
      await this.postingService.incrementTotalLikeWithSession(
        session,
        postPublicKey,
        1,
      );
    });

    return true;
  }

  async deleteLike(publicKey: string, postPublicKey: string) {
    const like = await this.likeModel.findOne({
      user: publicKey,
      post: postPublicKey,
    });

    if (!like)
      throw new BadRequestException(`error: you have not liked this post`);

    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await this.likeModel.deleteOne({ user: publicKey, post: postPublicKey });
      await this.postingService.incrementTotalLikeWithSession(
        session,
        postPublicKey,
        -1,
      );
    });

    return true;
  }
}

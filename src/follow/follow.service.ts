import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { FollowDB, FollowDocument } from 'schemas/follow.schema';
import { FollowPayloadData, UnfollowPayloadData } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(FollowDB.name)
    private followModel: Model<FollowDocument>,
  ) {}

  async getFollowByUser(user: string): Promise<FollowDB> {
    return await this.followModel.findOne({ user });
  }

  async getFollowByFollowing(following: string): Promise<FollowDB> {
    return await this.followModel.findOne({ following });
  }

  async getFollowUserAndFollowing(user: string, following: string) {
    return await this.followModel.findOne({ user, following });
  }

  async createFollow(session: ClientSession, data: FollowPayloadData) {
    if (data.user === data.following) {
      throw new BadRequestException(
        `Cannot follow your own account : ${data.user}`,
      );
    }

    const follow = new this.followModel<FollowDB>({
      signature: data.signature,
      user: data.user,
      following: data.following,
    });
    await follow.save({ session });
  }

  async deleteFollow(session: ClientSession, data: UnfollowPayloadData) {
    return await this.followModel.deleteOne(
      {
        user: data.user,
        following: data.following,
      },
      { session },
    );
  }
}

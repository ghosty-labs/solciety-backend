import { Injectable } from '@nestjs/common';
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

  async getFollowByUser(user: string) {
    return await this.followModel.findOne({ user });
  }

  async getFollowByFollowing(following: string) {
    return await this.followModel.findOne({ following });
  }

  async createFollow(session: ClientSession, data: FollowPayloadData) {
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

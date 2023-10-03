import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ProfileDB, ProfileDocument } from 'schemas/profile.schema';
import { ProfilePayload, PutProfilePayload } from './profile.entity';
import { generateProfileImage } from 'utils/profileImage';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileDB.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  async getProfile(publicKey: string) {
    return await this.profileModel.findOne({ public_key: publicKey });
  }

  async updateOrCreateProfile(
    publicKey: string,
    putProfilePayload: PutProfilePayload,
  ) {
    // TODO refactor this
    if (putProfilePayload.alias === undefined) putProfilePayload.alias = null;
    if (putProfilePayload.bio === undefined) putProfilePayload.bio = null;

    await this.validateAlias(putProfilePayload.alias);

    const profilePayload: ProfilePayload = Object.assign(
      {
        publicKey: publicKey,
        image: generateProfileImage(publicKey),
      },
      putProfilePayload,
    );

    return await this.profileModel.findOneAndUpdate(
      { public_key: publicKey },
      { $set: profilePayload },
      { upsert: true, returnDocument: 'after' },
    );
  }

  async updateHasNewPost(publicKey: string) {
    return await this.profileModel.updateMany(
      { public_key: { $ne: publicKey } },
      { $set: { has_new_post: true } },
    );
  }

  async updateHasNewPostByPublicKey(publicKey: string) {
    return await this.profileModel.updateOne(
      { public_key: publicKey },
      { $set: { has_new_post: false } },
    );
  }

  async incrementTotalPost(
    session: ClientSession,
    publicKey: string,
    value: number,
  ) {
    await this.profileModel.updateOne(
      { public_key: publicKey },
      { $inc: { total_post: value } },
      { session },
    );
  }

  async incrementTotalFollower(
    session: ClientSession,
    publicKey: string,
    value: number,
  ) {
    await this.profileModel.updateOne(
      { public_key: publicKey },
      { $inc: { total_follower: value } },
      { session },
    );
  }

  async incrementTotalFollowing(
    session: ClientSession,
    publicKey: string,
    value: number,
  ) {
    await this.profileModel.updateOne(
      { public_key: publicKey },
      { $inc: { total_following: value } },
      { session },
    );
  }

  async updateHasNotification(publicKey: string) {
    return await this.profileModel.updateOne(
      { public_key: publicKey },
      { $set: { has_notification: false } },
    );
  }

  private async getProfileByAlias(alias: string) {
    return await this.profileModel.findOne({ alias });
  }

  private async validateAlias(alias: string | null) {
    if (alias === null) return;

    const aliasExist = await this.getProfileByAlias(alias);
    if (aliasExist) {
      throw new BadRequestException(`alias already exist`);
    }

    const suffix = alias.slice(-3);
    if (suffix !== '.sol') {
      throw new BadRequestException(`alias must end with .sol`);
    }

    const userAlias = alias.split('.')[0];
    if (userAlias.length < 3) {
      throw new BadRequestException(`alias has minimum of 3 characters`);
    }
  }
}

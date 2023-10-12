import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { ProfileDB, ProfileDocument } from 'schemas/profile.schema';
import { Profile, ProfilePayload, PutProfilePayload } from './profile.entity';
import { generateProfileImage } from 'utils/profileImage';
import { mongoWithTransaction } from 'utils/mongoWithTransaction';
import { FollowService } from 'src/follow/follow.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileDB.name)
    private profileModel: Model<ProfileDocument>,

    @InjectConnection()
    private mongooseConnection: Connection,

    private readonly followService: FollowService,
  ) {}

  async checkProfileExist(publicKey: string) {
    const profile = await this.profileModel.findOne({ public_key: publicKey });
    if (!profile) return false;

    return true;
  }

  async getProfile(
    publicKey: string,
    userPublicKey?: string | null | undefined,
  ) {
    const profile = await this.profileModel.findOne({
      public_key: publicKey,
    });
    if (!profile) throw new BadRequestException(`Profile not found`);

    const result: Profile = {
      public_key: profile.public_key,
      image: profile.image,
      alias: profile.alias,
      bio: profile.bio,
      has_new_post: profile.has_new_post,
      has_notification: profile.has_notification,
      is_verified: profile.is_verified,
      total_post: profile.total_post,
      total_follower: profile.total_follower,
      total_following: profile.total_following,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    if (typeof userPublicKey === 'string') {
      const follow = await this.followService.getFollowByUser(userPublicKey);
      if (follow && follow.following === publicKey) {
        result['is_followed'] = true;
      }
    }

    return result;
  }

  async getNewPostingStatus(publicKey: string) {
    return await this.profileModel
      .findOne({ public_key: publicKey })
      .select({ _id: 0, has_new_post: 1 });
  }

  async getHasNotificationStatus(publicKey: string) {
    return await this.profileModel
      .findOne({ public_key: publicKey })
      .select({ _id: 0, has_notification: 1 });
  }

  async updateOrCreateProfile(
    publicKey: string,
    putProfilePayload: PutProfilePayload,
  ) {
    // TODO refactor this
    if (putProfilePayload.alias === undefined) putProfilePayload.alias = null;
    if (putProfilePayload.bio === undefined) putProfilePayload.bio = null;

    await this.validateAlias(putProfilePayload.alias);

    const profile = await this.getProfile(publicKey);
    const profilePayload: ProfilePayload = Object.assign(
      {
        publicKey: publicKey,
        image: profile ? profile.image : generateProfileImage(publicKey),
      },
      putProfilePayload,
    );

    return await this.profileModel.findOneAndUpdate(
      { public_key: publicKey },
      { $set: profilePayload },
      { upsert: true, returnDocument: 'after' },
    );
  }

  async updateHasNewPostExcept(publicKey: string) {
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

  async incrementTotalPost(publicKey: string, value: number) {
    await this.profileModel.updateOne(
      { public_key: publicKey },
      { $inc: { total_post: value } },
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

  async updateHasNotificationToTrue(session: ClientSession, publicKey: string) {
    return await this.profileModel.updateOne(
      { public_key: publicKey },
      { $set: { has_notification: true } },
      { session },
    );
  }

  async updateHasNotificationToFalse(publicKey: string) {
    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await this.profileModel.updateOne(
        { public_key: publicKey },
        { $set: { has_notification: false } },
        { session },
      );
    });

    return true;
  }

  async updateProfileAfterCreateNft(
    session: ClientSession,
    publicKey: string,
    imageUrl: string,
  ) {
    await this.profileModel.updateOne(
      { public_key: publicKey },
      { $set: { is_verified: true, image: imageUrl } },
      { session },
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

    const suffix = alias.slice(-4);
    if (suffix !== '.sol') {
      throw new BadRequestException(`alias must end with .sol`);
    }

    const userAlias = alias.split('.')[0];
    if (userAlias.length < 3) {
      throw new BadRequestException(`alias has minimum of 3 characters`);
    }
    if (userAlias.includes(' ')) {
      throw new BadRequestException(`alias cannot contain whitespace`);
    }
  }
}

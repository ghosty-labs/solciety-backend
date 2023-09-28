import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const aliasExist = await this.getProfileByAlias(putProfilePayload.alias);
    if (aliasExist) {
      throw new BadRequestException(`alias already exist`);
    }

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

  private async getProfileByAlias(alias: string) {
    return await this.profileModel.findOne({ alias });
  }

  private validateAlias(alias: string) {
    const suffix = alias.slice(-3);
    // TODO check suffix .sol
  }
}

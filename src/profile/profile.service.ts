import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileDB, ProfileDocument } from 'schemas/profile.schema';
import { HairVariant } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileDB.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  async updateOrCreateProfile(publicKey: string) {
    const randomValue = Math.floor(
      Math.random() * Object.keys(HairVariant).length,
    );
    const randomHairVariant =
      HairVariant[Object.keys(HairVariant)[randomValue]];

    return await this.profileModel.findOneAndUpdate(
      { public_key: publicKey },
      {
        $set: {
          public_key: publicKey,
          image: `https://api.dicebear.com/7.x/lorelei/svg?seed=${publicKey}&backgroundColor=3f3f46&scale=150&hair=${randomHairVariant}`,
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  async updateHasNewPost(publicKey: string) {
    return await this.profileModel.updateMany(
      { public_key: { $ne: publicKey } },
      { $set: { has_new_post: true } },
    );
  }
}

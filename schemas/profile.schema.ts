import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProfileDocument = Document & ProfileDB;

@Schema({
  collection: 'profiles',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ProfileDB {
  @Prop({ required: true, type: String })
  public_key: string;
  @Prop({ required: true, type: String })
  image: string;
  @Prop({ default: null })
  alias?: string;
  @Prop({ default: null })
  bio?: string;
  @Prop({ default: false })
  has_new_post: boolean;
  @Prop({ default: 0 })
  total_post?: number;
  @Prop({ default: 0 })
  total_follower?: number;
  @Prop({ default: 0 })
  total_following?: number;
  @Prop()
  created_at?: number;
  @Prop()
  updated_at?: number;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileDB);

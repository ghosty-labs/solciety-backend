import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FollowDocument = Document & FollowDB;

@Schema({
  collection: 'follows',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class FollowDB {
  @Prop({ required: true, type: String })
  signature: string;
  @Prop({ required: true, type: String })
  user: string;
  @Prop({ required: true, type: String })
  following: string;
  @Prop()
  created_at?: number;
  @Prop()
  updated_at?: number;
}

export const FollowSchema = SchemaFactory.createForClass(FollowDB);

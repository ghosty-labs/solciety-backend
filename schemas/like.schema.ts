import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LikeDocument = Document & LikeDB;

@Schema({
  collection: 'likes',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class LikeDB {
  @Prop({ required: true, type: String })
  user: string;
  @Prop({ required: true, type: String })
  post: string;
  @Prop()
  created_at?: number;
  @Prop()
  updated_at?: number;
}

export const LikeSchema = SchemaFactory.createForClass(LikeDB);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PostDocument = Document & PostDB;

@Schema({
  collection: 'posts',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class PostDB {
  @Prop({ required: true, type: String })
  signature: string;
  @Prop({ required: true, type: String })
  key: string;
  @Prop({ required: true, type: String })
  user: string;
  @Prop({ required: true, type: String })
  tag: string;
  @Prop({ required: true, type: String })
  content: string;
  @Prop({ default: 0 })
  total_comment: number;
  @Prop({ default: 0 })
  total_like: number;
  @Prop()
  created_at?: number;
  @Prop()
  updated_at?: number;
}

export const PostSchema = SchemaFactory.createForClass(PostDB);

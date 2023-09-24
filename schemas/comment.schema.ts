import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = Document & CommentDB;

@Schema({
  collection: 'comments',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class CommentDB {
  @Prop({ required: true, type: String })
  signature: string;
  @Prop({ required: true, type: String })
  key: string;
  @Prop({ required: true, type: String })
  user: string;
  @Prop({ required: true, type: String })
  post: string;
  @Prop({ required: true, type: String })
  parent: string;
  @Prop({ required: true, type: String })
  content: string;
  @Prop()
  created_at?: number;
  @Prop()
  updated_at?: number;
}

export const CommentSchema = SchemaFactory.createForClass(CommentDB);

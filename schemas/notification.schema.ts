import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationType } from 'src/notification/notification.entity';

export type NotificationDocument = Document & NotificationDB;

@Schema({
  collection: 'notifications',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class NotificationDB {
  @Prop({ required: true, type: String, enum: NotificationType })
  type: NotificationType;
  @Prop({ required: true, type: String })
  signature: string;
  @Prop({ required: true, type: String })
  user: string;
  @Prop({ required: true, type: String })
  from: string;
  @Prop({ type: String })
  icon: string;
  @Prop()
  data?: any;
  @Prop()
  created_at?: number;
  @Prop()
  updated_at?: number;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDB);
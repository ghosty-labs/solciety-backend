import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NftDocument = Document & NftDB;

@Schema({
  collection: 'nfts',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class NftDB {
  @Prop({ required: true, type: String })
  signature: string;
  @Prop({ required: true, type: String })
  user: string;
  @Prop({ required: true, type: String })
  candy_machine_id: string;
  @Prop({ required: true, type: String })
  mint_address: string;
  @Prop({ required: true, type: String })
  token_address: string;
  @Prop({ required: true, type: String })
  collection_address: string;
  @Prop({ required: true, type: String })
  name: string;
  @Prop()
  description?: string;
  @Prop()
  image?: string;
  @Prop({ default: [] })
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  @Prop()
  symbol?: string;
  @Prop()
  created_at?: number;
  @Prop()
  updated_at?: number;
}

export const NftSchema = SchemaFactory.createForClass(NftDB);

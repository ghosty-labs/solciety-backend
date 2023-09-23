import { ObjectId } from 'mongoose';

export class PostingDto {
  _id: ObjectId;
  signature: string;
  key: string;
  user: string;
  tag: string;
  content: string;
  timestamp: number;
}

export class GetPostingQueryDto {
  user: string;
  tag: string;
  search: string;
  __skip: string;
  __limit: string;
}

export class GetPostingResponseDto extends PostingDto {}

import { ObjectId } from 'mongoose';

export class CommentDto {
  _id: ObjectId;
  signature: string;
  key: string;
  user: string;
  post: string;
  parent: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export class GetCommentQueryDto {
  user: string;
  post: string;
  parent: string;
  __skip: string;
  __limit: string;
}

export class GetCommentResponseDto extends CommentDto {}

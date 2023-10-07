import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsOptional()
  @IsString()
  user: string;

  @IsOptional()
  @IsString()
  post: string;

  @IsOptional()
  @IsString()
  parent: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  __lookup_post: boolean;

  @IsOptional()
  @IsNumberString()
  __skip: string;

  @IsOptional()
  @IsNumberString()
  __limit: string;
}

export class GetCommentResponseDto extends CommentDto {}

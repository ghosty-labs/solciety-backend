import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { ProfileDto } from 'src/profile/profile.dto';

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

export class GetNewPostStatusQueryDto {
  public_key: string;
}

export class LikePostBodyDto {
  @IsString()
  @IsNotEmpty()
  post: string;
}

export class UnlikePostBodyDto {
  @IsString()
  @IsNotEmpty()
  post: string;
}

export class GetPostingResponseDto extends PostingDto {}
export class GetNewPostStatusResponseDto extends ProfileDto {}

import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetLikeQueryDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsOptional()
  @IsNumberString()
  __skip: string;

  @IsOptional()
  @IsNumberString()
  __limit: string;
}

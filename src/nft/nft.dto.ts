import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostNftBodyDto {
  signature: string;
  mint_address: string;
  token_address: string;
  collection_address: string;
  name: string;
  uri: string;
}

export class GetNftQueryDto {
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

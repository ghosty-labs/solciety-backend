export class ProfileDto {
  public_key: string;
  image: string;
  alias?: string;
  bio?: string;
  has_new_post: boolean;
  created_at: number;
  updated_at: number;
}

export class PutProfileBodyDto {
  alias: string;
  bio: string;
}

export class GetProfileQueryDto {
  public_key: string;
}

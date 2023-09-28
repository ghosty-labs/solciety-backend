export class ProfileDto {
  public_key: string;
  image: string;
  alias?: string;
  has_new_post: boolean;
  created_at: number;
  updated_at: number;
}

export class Profile {
  public_key: string;
  image: string;
  alias: string | null;
  bio: string | null;
  has_new_post: boolean;
  has_notification: boolean;
  total_post: number;
  total_follower: number;
  total_following: number;
  created_at: number;
  updated_at: number;
  is_followed?: boolean;
  is_verified?: boolean;
}

export class ProfilePayload {
  publicKey: string;
  image: string;
  alias?: string;
  bio: string;
}

export class PutProfilePayload {
  alias: string;
  bio: string;
}

export interface RequestWithPublicKey extends Request {
  publicKey: string;
}

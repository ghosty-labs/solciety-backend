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
}

export class ProfilePayload {
  publicKey: string;
  image: string;
  alias: string;
  bio: string;
}

export class PutProfilePayload {
  alias: string;
  bio: string;
}

export interface RequestWithPublicKey extends Request {
  publicKey: string;
}

export enum HairVariant {
  Variant01 = 'variant01',
  Variant02 = 'variant02',
  Variant03 = 'variant03',
  Variant04 = 'variant04',
  Variant05 = 'variant05',
  Variant06 = 'variant06',
  Variant07 = 'variant07',
  Variant08 = 'variant08',
  Variant09 = 'variant09',
  Variant10 = 'variant10',
  Variant11 = 'variant11',
  Variant12 = 'variant12',
  Variant13 = 'variant13',
  Variant14 = 'variant14',
  Variant15 = 'variant15',
  Variant16 = 'variant16',
  Variant17 = 'variant17',
  Variant18 = 'variant18',
  Variant19 = 'variant19',
  Variant20 = 'variant20',
  Variant21 = 'variant21',
  Variant22 = 'variant22',
  Variant23 = 'variant23',
  Variant24 = 'variant24',
  Variant25 = 'variant25',
  Variant26 = 'variant26',
  Variant27 = 'variant27',
  Variant28 = 'variant28',
  Variant29 = 'variant29',
  Variant30 = 'variant30',
  Variant31 = 'variant31',
  Variant32 = 'variant32',
  Variant33 = 'variant33',
  Variant34 = 'variant34',
  Variant35 = 'variant35',
  Variant36 = 'variant36',
  Variant37 = 'variant37',
  Variant38 = 'variant38',
  Variant39 = 'variant39',
  Variant40 = 'variant40',
  Variant41 = 'variant41',
  Variant42 = 'variant42',
  Variant43 = 'variant43',
}

export enum EyesVariant {
  Variant01 = 'variant01',
  Variant02 = 'variant02',
  Variant03 = 'variant03',
  Variant04 = 'variant04',
  Variant05 = 'variant05',
  Variant06 = 'variant06',
  Variant07 = 'variant07',
  Variant08 = 'variant08',
  Variant09 = 'variant09',
  Variant10 = 'variant10',
  Variant11 = 'variant11',
  Variant12 = 'variant12',
  Variant13 = 'variant13',
  Variant14 = 'variant14',
  Variant15 = 'variant15',
  Variant16 = 'variant16',
  Variant17 = 'variant17',
  Variant18 = 'variant18',
  Variant19 = 'variant19',
  Variant20 = 'variant20',
  Variant21 = 'variant21',
  Variant22 = 'variant22',
}

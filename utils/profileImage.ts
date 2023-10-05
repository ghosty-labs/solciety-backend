import { HairVariant } from 'src/profile/profile.entity';

export const generateProfileImage = (publicKey: string) => {
  const randomValue = Math.floor(
    Math.random() * Object.keys(HairVariant).length,
  );
  const randomHairVariant = HairVariant[Object.keys(HairVariant)[randomValue]];
  const imageUrl = `https://api.dicebear.com/7.x/lorelei/png?seed=${publicKey}&backgroundColor=d1d4f9&scale=150&hair=${randomHairVariant}`;

  return imageUrl;
};

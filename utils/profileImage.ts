export const generateProfileImage = (publicKey: string) => {
  const imageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${publicKey}`;

  return imageUrl;
};

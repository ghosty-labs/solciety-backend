export const generateProfileImage = (publicKey: string) => {
  const imageUrl = `https://api.dicebear.com/7.x/initials/png?seed=${publicKey}`;

  return imageUrl;
};

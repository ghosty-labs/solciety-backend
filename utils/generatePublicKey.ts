import { Keypair } from '@solana/web3.js';

export const generatePublicKeyString = () => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();

  return publicKey;
};

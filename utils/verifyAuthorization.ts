import { UnauthorizedException } from '@nestjs/common';
import base58 = require('bs58');
import nacl = require('tweetnacl');

export const verifyAuthorization = (authorization: any) => {
  const decodedAuthHeader = Buffer.from(authorization, 'base64').toString();
  const authHeaderParts = decodedAuthHeader.split('&');

  if (authHeaderParts.length !== 4)
    throw new UnauthorizedException(`error.auth: authorization invalid`);

  const [appEnv, nonce, pubKey, signature] = authHeaderParts;
  const pubKeyUint8 = base58.decode(pubKey);
  const signatureUint8 = base58.decode(signature);
  const message = new TextEncoder().encode(
    `Solciety wants you to sign in with your Solana account:\n${pubKey}\n\nThis request will not trigger any blockchain transaction or cost any gas fee.\nID: ${appEnv}\nNonce: ${nonce}`,
  );

  const isSigned = nacl.sign.detached.verify(
    message,
    signatureUint8,
    pubKeyUint8,
  );

  return [isSigned, pubKey];
};

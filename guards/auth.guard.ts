import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import base58 = require('bs58');
import nacl = require('tweetnacl');

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.verifyAuth(context);
  }

  private async verifyAuth(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();

      const authorization = request.headers.authorization;
      if (!authorization) {
        throw new UnauthorizedException(
          `error.auth: please provide authorization`,
        );
      }

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

      if (!isSigned)
        throw new UnauthorizedException(`error.auth: verify auth failed`);

      request.publicKey = pubKey;
    }

    return true;
  }
}

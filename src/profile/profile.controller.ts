import {
  Body,
  Controller,
  Headers,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import base58 = require('bs58');
import nacl = require('tweetnacl');
import { PutProfileBodyDto } from './profile.dto';
import { PutProfilePayload } from './profile.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('/')
  async signin(@Headers() headers: any, @Body() body: PutProfileBodyDto) {
    const authorization = headers.authorization;
    const decodedAuthHeader = Buffer.from(authorization, 'base64').toString();
    const authHeaderParts = decodedAuthHeader.split('&');

    if (authHeaderParts.length !== 4)
      throw new UnauthorizedException(`error: authorization invalid`);

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

    if (!isSigned) throw new UnauthorizedException(`error: signin failed`);

    const profilePayload: PutProfilePayload = {
      alias: body.alias,
      bio: body.bio,
    };

    const profile = await this.profileService.updateOrCreateProfile(
      pubKey,
      profilePayload,
    );
    return profile;
  }
}

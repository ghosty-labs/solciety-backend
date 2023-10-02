import { Injectable, NestMiddleware } from '@nestjs/common';
import { verifyAuthorization } from 'utils/verifyAuthorization';

@Injectable()
export class PostingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    if (req.headers.authorization) {
      const [, pubKey] = verifyAuthorization(req.headers.authorization);
      req.publicKey = pubKey;
    }
    next();
  }
}

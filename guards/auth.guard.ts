import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyAuthorization } from 'utils/verifyAuthorization';

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

      const [isSigned, pubKey] = verifyAuthorization(authorization);

      if (!isSigned)
        throw new UnauthorizedException(`error.auth: verify auth failed`);

      request.publicKey = pubKey;
    }

    return true;
  }
}

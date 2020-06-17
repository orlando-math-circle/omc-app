import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from '../../account/account.entity';
import { AccountService } from '../../account/account.service';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { AuthPayload } from '../interfaces/token.interface';

export type AuthRequest = Request & { usr?: User; account: Account };

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: config.get('SECRET'),
    });
  }

  async validate(req: AuthRequest, payload: AuthPayload) {
    if (!payload.iat || (!payload.aid && !payload.uid)) {
      throw new UnauthorizedException('Malformed Token');
    }

    if (payload.uid) {
      req.usr = await this.userService.findOne(payload.uid);

      if (!req.usr) throw new UnauthorizedException('USER MISSING');
      if (!req.usr.account) throw new InternalServerErrorException();

      req.account = req.usr.account;
    } else if (payload.aid) {
      req.account = await this.accountService.findOne(payload.aid);

      if (!req.account) throw new UnauthorizedException('ACC MISSING');
    }

    if (req.account.logoutAt) {
      const logoutAt = req.account.logoutAt;
      const issuedAt = new Date(payload.iat * 1000);

      // Warning: The `iat` field on a JWT only has seconds precision.
      // The results are unpredictable if someone were to try to rapidly
      // use a token immediately after logging out. Thus the `>=`.
      if (logoutAt >= issuedAt) {
        throw new UnauthorizedException('Token Revoked');
      }
    }

    return true;
  }
}

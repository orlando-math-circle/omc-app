import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import moment from 'moment';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from '../../accounts/account.entity';
import { AccountService } from '../../accounts/account.service';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { AuthPayload } from '../interfaces/token.interface';
import { date } from '@hapi/joi';

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

      if (logoutAt > issuedAt) {
        console.log(`${logoutAt} > ${issuedAt}`);
        throw new UnauthorizedException('Token Revoked');
      }
    }

    return true;
  }
}

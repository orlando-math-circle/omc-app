import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRequest, AuthService } from '../auth.service';
import { AuthPayload } from '../interfaces/token.interface';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async function (
        req: AuthRequest,
        token: string,
        done: (error: Error | null, key: string | null) => void,
      ) {
        try {
          return done(null, await authService.getSigningKey(req, token));
        } catch (error) {
          return done(error, null);
        }
      },
    });
  }

  validate(payload: AuthPayload) {
    return payload;
  }
}

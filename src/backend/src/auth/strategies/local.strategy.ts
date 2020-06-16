import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthRequest } from './token.strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: AuthRequest, email: string, password: string) {
    const user = await this.authService.validateLogin(email, password);

    if (!user) throw new UnauthorizedException();
    if (!user.account) throw new InternalServerErrorException();

    req.usr = user;
    req.account = user.account;

    return true;
  }
}

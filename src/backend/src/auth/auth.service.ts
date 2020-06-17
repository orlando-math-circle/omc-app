import {
  BadRequestException,
  forwardRef,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { Account } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {}

  async validateLogin(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(account: Account, user: User) {
    const payload =
      account.users.length > 1 ? { aid: account.id } : { uid: user.id };

    return { token: this.sign(payload), complete: !!payload.uid };
  }

  async logout(account: Account) {
    await this.accountService.update(account, { logoutAt: new Date() });
  }

  public sign(payload: any, options?: SignOptions) {
    return this.jwtService.sign(payload, options);
  }

  public async verify(token: string, options?: VerifyOptions) {
    const payload = this.jwtService.verify(token, options);

    if (payload.email) {
      const user = await this.userService.findOne(payload.email);

      if (!user) throw new NotFoundException();
      if (user.emailVerified) throw new GoneException();

      return await this.userService.update(user, { emailVerified: true });
    }

    throw new BadRequestException();
  }
}

import {
  BadRequestException,
  forwardRef,
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { Account } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { BCRYPT_ROUNDS } from '../app.constants';
import { EmailService } from '../email/email.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import {
  AuthPayload,
  ResetPayload,
  Token,
  VerifyPayload,
} from './interfaces/token.interface';

export type AuthRequest = Request & { usr?: User; account: Account };

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  async validateLogin(email: string, password: string) {
    const user = await this.userService.findOne({ email }, ['account.users']);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(account: Account, user: User) {
    const payload =
      account.users.length > 1 ? { aid: account.id } : { uid: user.id };

    return {
      token: this.signJWT(
        payload,
        `${account.logoutHash}${this.config.get('SECRET')}`,
      ),
      complete: !!payload.uid,
    };
  }

  async logout(account: Account) {
    await this.accountService.update(account, {
      logoutHash: crypto.randomBytes(10).toString('hex'),
    });
  }

  /**
   * Creates a new token for a specific user on an account.
   *
   * @param account account with users to switch between
   * @param id id of the user to switch to
   */
  public switchUser(account: Account, id: number) {
    const hasId = account.users.getIdentifiers().includes(id);

    if (!hasId) throw new BadRequestException();

    return {
      token: this.signJWT(
        { uid: id },
        `${account.logoutHash}${this.config.get('SECRET')}`,
      ),
      complete: true,
    };
  }

  /**
   * Retrieves the secret key for verifying a JWT token from a
   * user or account within the payload.
   *
   * @param req request for attaching information
   * @param token JWT for decoding
   */
  public async getSigningKey(req: AuthRequest, token: string) {
    const payload = this.decodeJWT<AuthPayload>(token);

    if (!payload || !(payload.aid || payload.uid)) {
      throw new UnauthorizedException('Malformed Token');
    }

    if (payload.uid) {
      req.usr = await this.userService.findOne(payload.uid, [
        'account',
        'account.primaryUser',
        'account.users',
      ]);

      if (!req.usr) throw new UnauthorizedException('User missing');
      if (!req.usr.account) throw new InternalServerErrorException();

      req.account = req.usr.account;
    } else if (payload.aid) {
      req.account = await this.accountService.findOne(payload.aid, [
        'primaryUser',
        'users',
      ]);

      if (!req.account) throw new UnauthorizedException('Account missing');
    }

    return `${req.account.logoutHash}${this.config.get('SECRET')}`;
  }

  /**
   * Creates a JWT for the provided payload using the app-level secret
   * or with a provided secret.
   *
   * @param payload claims to include in the JWT
   * @param secret optional secret to override the app secret
   * @param options optional options for signing
   */
  public signJWT(payload: any, secret?: string, options?: jwt.SignOptions) {
    return jwt.sign(payload, secret || this.config.get('SECRET'), options);
  }

  /**
   * Verifies if the claims within a JWT are valid by validating the hash.
   * This will also reject the token if it is expired.
   *
   * @param token token to verify the claims of
   * @param secret optional secret to override the app secret
   * @param options optional options for signing
   */
  public verifyJWT<T extends Token = any>(
    token: string,
    secret?: string,
    options?: jwt.VerifyOptions,
  ) {
    return jwt.verify(token, secret || this.config.get('SECRET'), options) as T;
  }

  /**
   * Retrieves the claims of a JWT without verifying hashed component.
   * Unless you know what you're doing, you probably want `verifyJWT`.
   *
   * @param token token whose claims are to be extracted
   * @param options optional options for decoding
   */
  public decodeJWT<T extends Token = any>(
    token: string,
    options?: jwt.DecodeOptions,
  ) {
    return jwt.decode(token, options) as T;
  }

  /**
   * Verifies that a user owns an email so they can receive further notifications.
   * The security of this hinges on the app-level token secret being secure.
   *
   * @param token token for verifying the user's email
   */
  public async verifyEmail(token: string) {
    const payload = this.verifyJWT<VerifyPayload>(token);

    if (!payload || !('email' in payload))
      throw new BadRequestException('Malformed Token');

    const user = await this.userService.findOneOrFail({ email: payload.email });

    if (user.emailVerified) throw new GoneException();

    await this.userService.update(user, { emailVerified: true });
  }

  /**
   * Creates a password reset link for valid emails, otherwise does nothing.
   * The response should always be the same to prevent user fishing.
   *
   * @param email email address for sending the password reset link
   */
  public async forgotPassword(email: string) {
    const user = await this.userService.findOne({ email });

    if (!user) return;

    const token = this.signJWT(
      { uid: user.id },
      `${user.password}${this.config.get('SECRET')}`,
    );

    this.emailService.email(email, token);
  }

  /**
   * Verifies that a password reset token is valid. This method does not
   * perform password resets, only verifies that the token must have come
   * from the user's email address.
   *
   * Security is enforced through a secret combining the user's *current*
   * password hash and the app-level token secret. These tokens become
   * invalid whenever a password is changed, or they expire.
   *
   * @param token token to verify that the user
   */
  public async getValidResetTokenUser(token: string): Promise<User> {
    const unsafePayload = this.decodeJWT<ResetPayload>(token);

    if (!unsafePayload || !('uid' in unsafePayload))
      throw new BadRequestException('Malformed token');

    const user = await this.userService.findOne(unsafePayload.uid);

    // Don't use `findOneOrFail` as this would allow for user fishing,
    // or intentionally looking for non-404 errors.
    if (!user) throw new BadRequestException();

    // Errors here percolate to the `JsonWebTokenFilter`.
    this.verifyJWT(token, `${user.password}${this.config.get('SECRET')}`);

    return user;
  }

  /**
   * Changes the password of a user using a valid reset token.
   *
   * @param token token for resetting the user's password
   * @param password new password the user wants
   */
  public async resetUserPassword(token: string, password: string) {
    const user = await this.getValidResetTokenUser(token);

    password = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await this.userService.update(user, { password });
  }
}

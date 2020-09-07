import { PAYPAL_EXP_THRESHOLD } from '../app.constants';
import { PayPalTokenResponse } from './interfaces/authentication/token.interface';

export class PayPalToken {
  private readonly token: string;
  private readonly tokenType: string;
  private readonly expiresIn: number;
  private readonly createdOn: number;

  constructor(data: PayPalTokenResponse) {
    this.token = data.access_token;
    this.tokenType = data.token_type;
    this.expiresIn = data.expires_in * 1000;
    this.createdOn = Date.now();
  }

  get isValid() {
    return Boolean(this.token);
  }

  /**
   * Gets the expiration status of the token.
   */
  get isExpired() {
    return Date.now() > this.createdOn + this.expiresIn - PAYPAL_EXP_THRESHOLD;
  }

  /**
   * Gets the value for the Authorization header.
   */
  public getAuthString() {
    return `${this.tokenType} ${this.token}`;
  }
}

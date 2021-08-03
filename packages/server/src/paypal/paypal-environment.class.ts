import { Injectable } from '@nestjs/common';
import {
  PAYPAL_LIVE_BASEURL,
  PAYPAL_LIVE_WEBURL,
  PAYPAL_SANDBOX_BASEURL,
  PAYPAL_SANDBOX_WEBURL,
} from '../app.constants';

export class PayPalEnvironment {
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    public readonly baseUrl: string,
    public readonly webUrl: string,
  ) {}

  public getAuthorizationString() {
    const encoded = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    return `Basic ${encoded}`;
  }
}

@Injectable()
export class SandboxEnvironment extends PayPalEnvironment {
  constructor(clientId: string, clientSecret: string) {
    super(
      clientId,
      clientSecret,
      PAYPAL_SANDBOX_BASEURL,
      PAYPAL_SANDBOX_WEBURL,
    );
  }
}

@Injectable()
export class LiveEnvironment extends PayPalEnvironment {
  constructor(clientId: string, clientSecret: string) {
    super(clientId, clientSecret, PAYPAL_LIVE_BASEURL, PAYPAL_LIVE_WEBURL);
  }
}

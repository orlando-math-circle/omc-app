import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  serializeUser(account: Account, done: (err: Error, user: any) => void): any {
    done(null, { id: account.id });
  }

  deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ): any {
    done(null, payload);
  }
}

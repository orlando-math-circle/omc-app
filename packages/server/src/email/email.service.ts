import { Email } from './email.class';

export abstract class EmailService {
  public abstract send(email: Email): Promise<any>;
}

import { Injectable, Logger } from '@nestjs/common';
import { Email } from './email.class';
import { EmailService } from './email.service';

@Injectable()
export class DevelopmentEmailService extends EmailService {
  private readonly logger = new Logger(DevelopmentEmailService.name);

  constructor() {
    super();
  }

  /**
   * Prints any provided arguments to the console as a rudimentary
   * emailing sandBox.
   *
   * @param args Any
   */
  public async send(email: Email) {
    this.logger.log(JSON.stringify(email.toRequest(), null, 2));
  }
}

import { HttpException, HttpService, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { Email } from './email.class';
import { EmailService } from './email.service';

@Injectable()
export class ProductionEmailService extends EmailService {
  private readonly logger = new Logger(ProductionEmailService.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  /**
   * Sends an email object to the provided user(s) using SendGrid.
   *
   * @param email Email class.
   */
  public async send(email: Email) {
    try {
      const resp = this.http.post(
        'https://api.mailersend.com/v1/email',
        email.toRequest(),
        {
          headers: {
            Authorization: `Bearer ${this.config.MAILERSEND.KEY}`,
          },
        },
      );

      return (await firstValueFrom(resp))?.data;
    } catch (error) {
      const status = error.response?.status || 500;
      const message = error.response?.data || {
        message: 'Unexpected MailerSend error',
      };

      const exception = new HttpException(message, status);

      this.logger.error(exception.message);

      throw exception;
    }
  }
}

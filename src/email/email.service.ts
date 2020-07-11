import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  email(email: string, message: string) {
    this.logger.log(`EMAIL: ${email} -> ${message}`);
  }
}

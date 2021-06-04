import { Body, Controller, Post } from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { CreateEmailDto } from './dto/create-email.dto';
import { Email } from './email.class';
import { EMAIL_SENDER_EMAIL, EMAIL_SENDER_NAME } from './email.constants';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @UserAuth('email', 'create:any')
  @Post()
  async email(@Body() { emails, subject, html, text }: CreateEmailDto) {
    const email = new Email()
      .setTo(emails.map((email) => ({ email })))
      .setFrom(EMAIL_SENDER_EMAIL, EMAIL_SENDER_NAME)
      .setSubject(subject)
      .setHTML(html, text);

    return this.emailService.send(email);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  email(@Body() body: any) {
    return this.emailService.email(EmailController.name, body.to, body.message);
  }
}

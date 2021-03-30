import { Body, Controller, Post } from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @UserAuth('email', 'create:any')
  @Post()
  async email(@Body() { userIds, subject, body }: CreateEmailDto) {
    // return this.emailService.custom(userIds, subject, body);
  }
}

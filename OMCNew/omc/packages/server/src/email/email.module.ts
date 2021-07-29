import { Global, HttpModule, Module } from '@nestjs/common';
import { DevelopmentEmailService } from './development-email.service';
import { EmailController } from './email.controller';
import { EmailScheduler } from './email.schedule';
import { EmailService } from './email.service';
import { ProductionEmailService } from './production-email.service';

const emailServiceProvider = {
  provide: EmailService,
  useClass:
    process.env.EMAIL_SANDBOXED === 'false'
      ? ProductionEmailService
      : DevelopmentEmailService,
};

@Global()
@Module({
  imports: [HttpModule],
  providers: [EmailScheduler, emailServiceProvider],
  controllers: [EmailController],
  exports: [emailServiceProvider],
})
export class EmailModule {}

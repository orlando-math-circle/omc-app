import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';
import { ConfigSchema } from '../app.config';
import { SENDGRID_TOKEN } from './email.constants';
import { EmailController } from './email.controller';
import { EmailSandbox } from './email.sandbox';
import { EmailScheduler } from './email.schedule';
import { EmailService } from './email.service';

const EmailFactory = {
  provide: SENDGRID_TOKEN,
  useFactory: (config: ConfigService<ConfigSchema>) => {
    if (config.get('SENDGRID_SANDBOXED') === true) {
      return new EmailSandbox();
    } else {
      SendGrid.setApiKey(config.get('SENDGRID_API_KEY')!);

      return SendGrid;
    }
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [],
  providers: [EmailService, EmailScheduler, EmailFactory],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}

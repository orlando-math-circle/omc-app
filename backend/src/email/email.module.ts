import { Global, Module } from '@nestjs/common';
import { EmailScheduler } from './email.schedule';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [],
  providers: [EmailService, EmailScheduler],
  controllers: [],
  exports: [EmailService],
})
export class EmailModule {}

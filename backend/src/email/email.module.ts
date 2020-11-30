import { Global, Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailScheduler } from './email.schedule';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [],
  providers: [EmailService, EmailScheduler],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}

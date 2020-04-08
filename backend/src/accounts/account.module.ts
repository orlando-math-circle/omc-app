import { Module, Global } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Global()
@Module({
  imports: [],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}

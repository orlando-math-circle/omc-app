import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';

@Module({
  imports: [MikroOrmModule.forFeature([Account]), EmailModule, UserModule],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}

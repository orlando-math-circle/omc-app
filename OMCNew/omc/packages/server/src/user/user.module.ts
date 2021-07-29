import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserScheduler } from './user.scheduler';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService, UserScheduler],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

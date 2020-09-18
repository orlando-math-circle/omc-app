import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from '../account/account.entity';
import { Acc } from '../auth/decorators/account.decorator';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserDto } from './dtos/find-user.dto';
import { FindUsersDto } from './dtos/find-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UserAuth('user', 'create:own')
  @Post()
  create(@Acc() account: Account, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(account, createUserDto);
  }

  @UserAuth()
  @Get('me')
  getMe(@Usr() user: User) {
    return user;
  }

  @UserAuth('user', 'read:any')
  @Get()
  findAll(@Query() { limit, offset, ...where }: FindUsersDto) {
    return this.userService.findAll(where, limit, offset);
  }

  @UserAuth('user', 'update:any')
  @Patch(':id')
  update(@Param() { id }: FindUserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UserAuth('user', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindUserDto) {
    return this.userService.delete(id);
  }
}

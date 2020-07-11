import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Account } from '../account/account.entity';
import { Acc } from '../auth/decorators/account.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { UserGuard } from '../auth/guards/user.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserDto } from './dtos/find-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth('user', 'create:own')
  @Post()
  create(@Acc() account: Account, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(account, createUserDto);
  }

  @UseGuards(UserGuard)
  @Get('me')
  getMe(@Usr() user: User) {
    return user;
  }

  @Auth('user', 'update:any')
  @Patch(':id')
  update(@Param() { id }: FindUserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Auth('user', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindUserDto) {
    return this.userService.delete(id);
  }
}

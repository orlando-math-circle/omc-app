import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { Account } from '../accounts/account.entity';
import { Acc } from '../auth/decorators/account.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { UserGuard } from '../auth/guards/user.guard';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserGuard)
  @Get('me')
  getMe(@Usr() user: User) {
    return user;
  }

  @Auth('user', 'create:own')
  create(@Acc() account: Account, @Body() createUserDTO: CreateUserDTO) {
    console.log(account, createUserDTO);
  }

  @Auth('user', 'update:any')
  update(id: number, updateUserDTO: UpdateUserDTO) {
    return this.userService.update(id, updateUserDTO);
  }

  @Auth('user', 'delete:any')
  delete(id: number) {
    return this.userService.delete(id);
  }
}

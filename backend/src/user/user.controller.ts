import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Account } from '../account/account.entity';
import { Acc } from '../auth/decorators/account.decorator';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { Usr } from '../auth/decorators/user.decorator';
import { FileInterceptor } from '../file/interceptors/file.interceptor';
import { MulterFile } from '../file/interfaces/multer-file.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserDto } from './dtos/find-user.dto';
import { FindUsersDto } from './dtos/find-users.dto';
import { UpdateOwnUserDto } from './dtos/update-own-user.dto';
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
  @Get('statistics')
  findUserStatistics() {
    return this.userService.getUserStatistics();
  }

  @UserAuth('user', 'read:any')
  @Get()
  findAll(@Query() { limit, offset, contains, orderBy }: FindUsersDto) {
    // Prevent sorting by computed property.
    if (orderBy && 'name' in orderBy) {
      orderBy['first'] = orderBy.name;
      orderBy['last'] = orderBy.name;

      delete orderBy.name;
    }

    return this.userService.findAll(
      contains
        ? ({
            $or: [
              { 'lower(id::text)': { $like: `%${contains}%` } },
              { 'lower(first)': { $like: `%${contains}%` } },
              { 'lower(last)': { $like: `%${contains}%` } },
              { 'lower(roles::text)': { $like: `%${contains}%` } },
              { 'lower(fee_waived::text)': { $like: `%${contains}%` } },
              { 'lower(email_verified::text)': { $like: `%${contains}%` } },
              { 'lower(email_verified::text)': { $like: `%${contains}%` } },
            ],
          } as any)
        : {},
      {},
      limit,
      offset,
      orderBy,
    );
  }

  @UserAuth('user', 'read:any')
  @Get(':id')
  findOne(@Param() { id }: FindUserDto) {
    return this.userService.findOneOrFail(id);
  }

  @UserAuth('user', 'update:any')
  @Patch(':id')
  update(@Param() { id }: FindUserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UserAuth('user', 'update:own')
  @Patch('/own/:id')
  updateOwn(
    @Param('id') id: number,
    @Body() updateOwnUserDto: UpdateOwnUserDto,
    @Usr() user: User,
  ) {
    return this.userService.update(id, updateOwnUserDto, user);
  }

  @UserAuth('user', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindUserDto) {
    return this.userService.delete(id);
  }

  @UserAuth('file', 'create:own')
  @Post('form/:id')
  @UseInterceptors(
    FileInterceptor('form', 'forms', {
      fileSize: 10000000,
    }),
  )
  uploadForm(@UploadedFile() file: MulterFile, @Param('id') id: number) {
    return this.userService.uploadForm(file, id);
  }

  @UserAuth('file', 'read:own')
  @Get('form/fishy')
  findForms(@Acc() account: Account) {
    console.log(account);
    return this.userService.findForms(
      {
        attachments: {
          user: { id: { $in: account.users.getIdentifiers() as number[] } },
        },
      },
      ['attachments'],
    );
  }
}

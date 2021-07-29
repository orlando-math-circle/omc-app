import { expr } from '@mikro-orm/core';
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
  findAll(
    @Query() { limit, offset, grade, role, contains, orderBy }: FindUsersDto,
  ) {
    // Prevent sorting by a computed property.
    if (orderBy && 'name' in orderBy) {
      orderBy['first'] = orderBy.name;
      orderBy['last'] = orderBy.name;

      delete orderBy.name;
    }

    const roles = Array.isArray(role) ? role : [role];

    // This is a workaround because the $in operator does not seem to work
    // on the roles enum array. If that is fixed, this can be simplified.
    const rolesOrQuery =
      (role && [...roles.map((role) => ({ roles: { $contains: [role] } }))]) ||
      [];
    const containsOrQuery =
      (contains && [
        { [expr('lower(id::text)')]: { $like: `%${contains}%` } },
        { [expr('lower(first)')]: { $like: `%${contains}%` } },
        { [expr('lower(last)')]: { $like: `%${contains}%` } },
        { [expr("lower(first || ' ' || last)")]: { $like: `%${contains}%` } },
        { [expr('lower(roles::text)')]: { $like: `%${contains}%` } },
        {
          [expr('lower(fee_waived::text)')]: { $like: `%${contains}%` },
        },
        {
          [expr('(grade::text)')]: { $like: `%${contains}%` },
        },
        {
          [expr('lower(email)')]: { $like: `%${contains}%` },
        },
        {
          [expr('lower(email_verified::text)')]: {
            $like: `%${contains}%`,
          },
        },
      ]) ||
      [];

    return this.userService.findAll(
      Object.assign(
        {},
        contains &&
          role && {
            $and: [{ $or: containsOrQuery }, { $or: rolesOrQuery }],
          },
        contains && { $or: containsOrQuery },
        role && { $or: rolesOrQuery },
        grade && { grade: { $in: Array.isArray(grade) ? grade : [grade] } },
      ),
      {
        limit,
        offset,
        orderBy,
      },
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

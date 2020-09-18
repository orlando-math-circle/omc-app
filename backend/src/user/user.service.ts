import { EntityRepository, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Account } from '../account/account.entity';
import { isNumber } from '../app.utils';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(account: Account, createUserDto: CreateUserDto) {
    // TODO: Add logic for validating these emails, age checks, ...etc.
    const user = this.userRepository.create(createUserDto);

    account.users.add(user);

    await this.userRepository.flush();

    return user;
  }

  /**
   * Proxy method for retrieving an individual user or returns null.
   *
   * @param where object query of the properties to use for retrieval
   * @param populate which, or all, relationships to populate
   */
  async findOne(where: FilterQuery<User>, populate?: boolean | string[]) {
    return this.userRepository.findOne(where, populate);
  }

  async findOneOrFail(
    id: number,
    populate?: boolean | string[],
    orderBy?: QueryOrderMap,
  ): Promise<User>;
  async findOneOrFail(
    email: string,
    populate?: boolean | string[],
    orderBy?: QueryOrderMap,
  ): Promise<User>;
  async findOneOrFail(
    idOrEmail: number | string,
    populate?: boolean | string[],
    orderBy?: QueryOrderMap,
  ) {
    return this.userRepository.findOneOrFail(
      typeof idOrEmail === 'number' ? { id: idOrEmail } : { email: idOrEmail },
      populate,
      orderBy,
    );
  }

  findAll(where: FilterQuery<User>, limit: number, offset: number) {
    return this.userRepository.findAndCount(where, { limit, offset });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  async update(user: User, updateUserDto: UpdateUserDto): Promise<User>;
  async update(idOrUser: number | User, updateUserDto: UpdateUserDto) {
    const user = isNumber(idOrUser)
      ? await this.userRepository.findOneOrFail(idOrUser)
      : idOrUser;

    user.assign(updateUserDto);

    await this.userRepository.flush();

    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.findOneOrFail(id);

    return this.userRepository.remove(user).flush();
  }
}

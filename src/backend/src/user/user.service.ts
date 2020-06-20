import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'mikro-orm';
import { InjectRepository } from 'nestjs-mikro-orm';
import { isNumber } from '../app.utils';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { Account } from '../account/account.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(account: Account, createUserDTO: CreateUserDTO) {
    // TODO: Add logic for validating these emails, age checks, ...etc.
    const user = this.userRepository.create(createUserDTO);

    account.users.add(user);

    await this.userRepository.flush();

    return user;
  }

  async findOne(id: number): Promise<User>;
  async findOne(email: string): Promise<User>;
  async findOne(idOrEmail: number | string) {
    return this.userRepository.findOne(
      typeof idOrEmail === 'number' ? { id: idOrEmail } : { email: idOrEmail },
      true,
    );
  }

  async findOneOrFail(id: number): Promise<User>;
  async findOneOrFail(email: string): Promise<User>;
  async findOneOrFail(idOrEmail: number | string) {
    return this.userRepository.findOneOrFail(
      typeof idOrEmail === 'number' ? { id: idOrEmail } : { email: idOrEmail },
      true,
    );
  }

  async update(id: number, updateUserDTO: UpdateUserDTO): Promise<User>;
  async update(user: User, updateUserDTO: UpdateUserDTO): Promise<User>;
  async update(idOrUser: number | User, updateUserDTO: UpdateUserDTO) {
    const user = isNumber(idOrUser)
      ? await this.userRepository.findOneOrFail(idOrUser)
      : idOrUser;

    user.assign(updateUserDTO);

    await this.userRepository.flush();

    return user;
  }

  async delete(id: number) {
    return this.userRepository.remove({ id }, true);
  }
}

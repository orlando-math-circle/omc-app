import { EntityRepository, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from '../account/account.entity';
import { REDUCED_LUNCH_FIELD } from '../app.constants';
import { isNumber, Populate, PopulateFail } from '../app.utils';
import { File } from '../file/entities/file.entity';
import { Form } from '../file/entities/form.entity';
import { FileService } from '../file/file.service';
import { MulterFile } from '../file/interfaces/multer-file.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly fileService: FileService,
  ) {}

  /**
   * Creates a new user for the given account.
   *
   * @param account Account to add the user to.
   * @param createUserDto Data necessary for creating a new user.
   */
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
   * @param where Primary key or query condition.
   * @param populate Population boolean, string, string array, or query.
   */
  async findOne(where: FilterQuery<User>, populate?: Populate<User>) {
    return this.userRepository.findOne(where, populate);
  }

  /**
   * Retrieves an individual user or throws an exception.
   *
   * @param where Primary key or query condition.
   * @param populate Population boolean, string, string array, or query.
   */
  async findOneOrFail(
    where: FilterQuery<User>,
    populate?: PopulateFail<User>,
    orderBy?: QueryOrderMap,
  ) {
    return this.userRepository.findOneOrFail(where, populate, orderBy);
  }

  /**
   * Retrieves all users with pagination methods and returns the
   * matching users and a count of all users matching the query.
   *
   * @param where Primary key or query condition.
   * @param limit Maximum number of users to return.
   * @param offset Number of users to skip.
   */
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

  /**
   * Deletes a user if it is found, otherwise throws an exception.
   *
   * @param id Priamry key of the user.
   */
  async delete(id: number) {
    const user = await this.userRepository.findOneOrFail(id);

    return this.userRepository.remove(user).flush();
  }

  async uploadForm(metadata: MulterFile, user: User) {
    if (typeof metadata == null) {
      throw new BadRequestException('No file uploaded');
    }

    // This field is hardcoded, but others don't need to be.
    const form = new Form(REDUCED_LUNCH_FIELD);
    const file = new File(metadata);
    form.file = file;

    user.files.add(file);
    user.forms.add(form);

    await this.userRepository.flush();

    return file;
  }
}

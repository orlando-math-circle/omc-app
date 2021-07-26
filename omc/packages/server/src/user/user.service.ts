import {
  EntityRepository,
  FilterQuery,
  FindOptions,
  QueryOrder,
  QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { eachWeekOfInterval, format, sub } from 'date-fns';
import { Account } from '../account/account.entity';
import { BCRYPT_ROUNDS } from '../app.constants';
import { isBetweenInclusive, Populate, PopulateFail } from '../app.utils';
import { ConfigService } from '../config/config.service';
import { FileAttachment } from '../file-attachment/file-attachment.entity';
import { File } from '../file/file.entity';
import { ApprovalStatus } from '../file/interfaces/approval-status.enum';
import { MulterFile } from '../file/interfaces/multer-file.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateOwnUserDto } from './dtos/update-own-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly avatars: Record<string, string> = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    config: ConfigService,
  ) {
    for (let i = 0; i < 10; i++) {
      this.avatars[i] = `${config.FILES.DEFAULT_AVATAR_FOLDER}/${i}.png`;
    }
  }

  /**
   * Creates a new user for the given account.
   * TODO: Add logic for validating these emails, age checks, ...etc.
   *
   * @param account Account to add the user to.
   * @param createUserDto Data necessary for creating a new user.
   */
  async create(account: Account, createUserDto: CreateUserDto) {
    if (createUserDto.industry) {
      createUserDto.industry = classToPlain(createUserDto.industry);
    }

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
   * @param populate Relationships to populate.
   * @param limit Maximum number of users to return.
   * @param offset Number of users to skip.
   * @param orderBy Ordering query.
   */
  findAll(where: FilterQuery<User>, options?: FindOptions<User>) {
    return this.userRepository.findAndCount(where, options);
  }

  public async update(
    id: number,
    dto: UpdateUserDto | UpdateOwnUserDto,
    author?: User,
  ) {
    let user: User | undefined;

    if (author) {
      user = author.account.users.getItems().find((u) => u.id === id);

      if (!user) {
        throw new NotFoundException();
      }
    } else {
      user = await this.userRepository.findOneOrFail(id);
    }

    if (dto.avatar && Object.keys(this.avatars).includes(dto.avatar)) {
      dto.avatar = this.avatars[dto.avatar];
    }

    if (dto.industry) {
      dto.industry = classToPlain(dto.industry);
    }

    if ('password' in dto) {
      dto.password = await bcrypt.hash(dto.password!, BCRYPT_ROUNDS);
    }

    user.assign(dto);

    await this.userRepository.flush();

    return user;
  }

  /**
   * Deletes a user if it is found, otherwise throws an exception.
   *
   * @param id Priamry key of the user.
   */
  async delete(id: number) {
    const user = await this.userRepository.findOneOrFail(id, true);

    return this.userRepository.remove(user).flush();
  }

  async uploadForm(metadata: MulterFile, userOrId: User | number) {
    if (typeof metadata == null) {
      throw new BadRequestException('No file uploaded');
    }

    const user =
      typeof userOrId === 'number'
        ? await this.userRepository.findOneOrFail(userOrId, ['attachments'])
        : userOrId;

    if (user.attachments.length > 0) {
      for (const attachment of user.attachments) {
        if (attachment.status === ApprovalStatus.PENDING) {
          throw new ConflictException('Pending form');
        }
      }
    }

    // This field is hardcoded, but others don't need to be.
    const form = new FileAttachment();
    const file = new File(metadata);
    form.file = file;

    user.files.add(file);
    user.attachments.add(form);

    await this.userRepository.flush();

    return file;
  }

  findForms(where: FilterQuery<User>, populate: PopulateFail<User>) {
    return this.userRepository.findOneOrFail(where, ['attachments'], populate);
  }

  async getUserStatistics() {
    const retval: Record<string, number> = {};
    const now = new Date();
    const monthAgo = sub(now, { months: 1 });
    const weeks = eachWeekOfInterval({ start: monthAgo, end: now });
    const labels = weeks.map(
      (week) => 'Week of ' + format(week, 'EEE, MMM qo, yyyy'),
    );

    const [users, count] = await this.userRepository.findAndCount(
      {
        createdAt: { $gte: weeks[0] },
      },
      { orderBy: { createdAt: QueryOrder.ASC } },
    );

    // This could be more efficient, but not impacting anything.
    for (let i = 0; i < weeks.length; i++) {
      retval[weeks[i].toISOString()] = 0;

      for (let j = 0; j < users.length; j++) {
        if (isBetweenInclusive(weeks[i], weeks[i + 1], users[j].createdAt)) {
          retval[weeks[i].toISOString()] += 1;
        }
      }
    }

    return { month: retval, count, labels };
  }
}

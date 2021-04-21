import {
  EntityRepository,
  FilterQuery,
  FindOptions,
  QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Populate } from './../app.utils';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { VolunteerWorkStatus } from './enums/work-status.enum';
import { VolunteerWork } from './volunteer-work.entity';

type EntityFilter = FilterQuery<VolunteerWork>;
type EntityOptions = FindOptions<VolunteerWork>;
type EntityPopulate = Populate<VolunteerWork>;

@Injectable()
export class VolunteerWorkService {
  constructor(
    @InjectRepository(VolunteerWork)
    private readonly volunteerWorkRepository: EntityRepository<VolunteerWork>,
  ) {}

  /**
   * Creates a new volunteer work for the specified user and optionally, project.
   *
   * @param createWorkDto Entity data.
   */
  async create(createWorkDto: CreateWorkDto, nonAdmin?: User) {
    const work = this.volunteerWorkRepository.create(createWorkDto);

    if (nonAdmin) {
      if (!nonAdmin.account.users.contains(nonAdmin)) {
        throw new BadRequestException();
      }

      work.status = VolunteerWorkStatus.PENDING;
    } else {
      work.status = VolunteerWorkStatus.APPROVED;
    }

    await this.volunteerWorkRepository.persist(work).flush();

    return work;
  }

  /**
   * Finds a single volunteer work by id.
   *
   * @param where Query for selecting the wwork
   * @param populate Relationships to load
   */
  async findOneOrFail(
    where: EntityFilter,
    populate?: EntityPopulate,
    orderBy?: QueryOrderMap,
  ) {
    return this.volunteerWorkRepository.findOneOrFail(where, populate, orderBy);
  }

  /**
   * Finds and paginates all volunteer works matching an optional query.
   *
   * @param where
   * @param populate
   * @param limit
   * @param offset
   * @param orderBy
   */
  async findAll(where: EntityFilter, options?: EntityOptions) {
    return this.volunteerWorkRepository.findAndCount(where, options);
  }

  /**
   * Updates a single work.
   *
   * @param where Query for selecting the work
   * @param updateWorkDto Properties to update in the work
   */
  async update(where: EntityFilter, updateWorkDto: UpdateWorkDto) {
    const work = await this.volunteerWorkRepository.findOneOrFail(where);

    work.assign(updateWorkDto);

    await this.volunteerWorkRepository.flush();

    return work;
  }

  /**
   * Deletes a work entity.
   *
   * @param where Query for selecting the work
   */
  async delete(where: EntityFilter) {
    const work = await this.volunteerWorkRepository.findOneOrFail(where, false);

    this.volunteerWorkRepository.remove(work);

    await this.volunteerWorkRepository.flush();
  }
}

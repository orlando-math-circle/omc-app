import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { VolunteerWork } from './volunteer-work.entity';

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
  async create(createWorkDto: CreateWorkDto) {
    const work = this.volunteerWorkRepository.create(createWorkDto);

    await this.volunteerWorkRepository.persist(work).flush();

    return work;
  }
}

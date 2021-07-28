import { EntityManager, EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MarkAttendanceDto } from './dtos/mark-attendance.dto';
import { UpdateAttendanceDto } from './dtos/update-attendance.dto';
import { Attendance } from './attendance.entity';
import { UserService } from '@server/user/user.service';
import { EventService } from '@server/event/event.service';
import { VolunteerWork } from '@server/volunteer-work/volunteer-work.entity';
import { VolunteerWorkStatus } from '@server/volunteer-work/enums/work-status.enum';
import {
  FilterQuery,
  FindOptions,
  Populate,
  QueryOrderMap,
} from '@mikro-orm/core';
import { PopulateFail } from '@server/app.utils';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: EntityRepository<Attendance>,
    private readonly em: EntityManager,
    private readonly userService: UserService,
    private readonly eventService: EventService,
  ) {}

  public async create({ userId, eventId, ...data }: MarkAttendanceDto) {
    const attendance = this.attendanceRepository.create({
      ...data,
      user: userId,
      event: eventId,
    });

    const event = await this.eventService.findOneOrFail(eventId);

    const user = await this.userService.findOneOrFail(userId, [
      'work',
      'registrations',
      'attendances',
    ]);

    // Prevent duplicate attendances from being added to the db
    for (let i = 0; i < user.attendances.length; i++) {
      if (
        user.attendances[i].event.id === event.id &&
        user.attendances[i].attended
      ) {
        throw new BadRequestException(
          'Attendance for this event has already been marked.',
        );
      }
      if (
        user.attendances[i].event.id === event.id &&
        !user.attendances[i].attended
      ) {
        throw new BadRequestException(
          'Attendance for this event has already been marked.',
        );
      }
    }

    // Check for user, registration, and permissions

    if (event.isEnded) {
      attendance.user = user;

      if (!event.hasPermission(user)) {
        throw new ForbiddenException();
      }

      // If volunteering, pick out the event from user registrations
      // There's probably a better way of doing this
      for (let i = 0; i < user.registrations.length; i++) {
        console.log(i + ': ' + user.registrations[i].volunteering);
        if (
          event.id === user.registrations[i].event.id &&
          user.registrations[i].volunteering
        ) {
          const work = new VolunteerWork();
          work.hours = data.hours;
          work.status = VolunteerWorkStatus.PENDING;
          work.notes =
            'Volunteered at ' + event.name + ' for ' + work.hours + ' hour(s).';
          work.user = user;

          user.work.add(work);
        }
      }
    } else {
      throw new BadRequestException(
        "Attendance can't be marked to open events",
      );
    }

    await this.attendanceRepository.persist(attendance).flush();

    return attendance;
  }

  public async findAll(
    where: FilterQuery<Attendance>,
    options?: FindOptions<Attendance>,
  ) {
    return this.attendanceRepository.findAndCount(where, options);
  }

  findOne(where: FilterQuery<Attendance>, populate?: Populate<Attendance>) {
    return this.attendanceRepository.findOne(where, populate);
  }

  /**
   * Retrieves an individual user or throws an exception.
   *
   * @param where Primary key or query condition.
   * @param populate Population boolean, string, string array, or query.
   */
  async findOneOrFail(
    where: FilterQuery<Attendance>,
    populate?: PopulateFail<Attendance>,
    orderBy?: QueryOrderMap,
  ) {
    return this.attendanceRepository.findOneOrFail(where, populate, orderBy);
  }

  public async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.attendanceRepository.findOneOrFail(id);

    this.attendanceRepository.assign(attendance, updateAttendanceDto);

    await this.attendanceRepository.flush();

    return attendance;
  }

  public async destroy(id: number) {
    const attendance = await this.attendanceRepository.findOneOrFail(id);

    await this.attendanceRepository.remove(attendance).flush();
  }
}

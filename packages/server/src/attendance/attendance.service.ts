import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './attendance.entity';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { VolunteerWork } from '../volunteer-work/volunteer-work.entity';
import { VolunteerWorkStatus } from '../volunteer-work/enums/work-status.enum';
import {
  FilterQuery,
  FindOptions,
  Populate,
  QueryOrderMap,
} from '@mikro-orm/core';
import { PopulateFail } from '../app.utils';
import { User } from '../user/user.entity';
import { AttendanceStatus } from './dto/attendance-status.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: EntityRepository<Attendance>,
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
      'registrations',
      'attendances',
    ]);

    // Prevent duplicate attendances from being added to the db
    for (const attendance of user.attendances) {
      if (
        (attendance.event.id === event.id && attendance.attended) ||
        !attendance.attended
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

      // If volunteering, pick out the event from user registrations and make a Work order
      // There's probably a better way of doing this
      for (const registration of user.registrations) {
        if (registration.event.id === event.id && registration.volunteering) {
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

  public async getAttendanceStatus(eventId: number, user: User) {
    const retval: AttendanceStatus[] = [];

    // Populate attendances for access
    const userAttend = await this.userService.findOneOrFail(user.id, [
      'attendances',
    ]);

    // Find attendance that matches the event
    for (const attendanceItem of userAttend.attendances) {
      if (attendanceItem.event.id === eventId) {
        retval.push({
          attended: attendanceItem.attended,
          attendance: attendanceItem,
        });
      }
    }

    return retval;
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

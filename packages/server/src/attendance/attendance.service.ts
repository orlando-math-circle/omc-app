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
import { FilterQuery } from '@mikro-orm/core';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: EntityRepository<Attendance>,
    private readonly em: EntityManager,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly volunteerWorkRepository: EntityRepository<VolunteerWork>,
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

    // Check for user, registration, and permissions

    if (event.isEnded) {
      attendance.user = user;

      if (!event.hasPermission(user)) {
        throw new ForbiddenException();
      }

      console.log(user.volunteerHours);

      console.log(user.registrations);

      // console.log(event);

      // If volunteering, pick out the event from user registrations
      // There's probably a better way of doing this
      for (let i = 0; i < user.registrations.length; i++) {
        console.log(i + ': ' + user.registrations[i].volunteering);
        if (
          event.id == user.registrations[i].event.id &&
          user.registrations[i].volunteering
        ) {
          console.log(i + 'is the index of event id that matches');

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

  public findAll(limit = 20, offset = 0) {
    return this.attendanceRepository.findAndCount(
      {},
      { limit, offset, populate: ['user'] },
    );
  }

  public findOne(id: number) {
    return this.attendanceRepository.findOneOrFail(id);
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

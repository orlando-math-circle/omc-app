import { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { differenceInYears } from 'date-fns';
import { Grade } from './enums/grade.enum';
import { User } from './user.entity';

@Injectable()
export class UserScheduler {
  private readonly logger = new Logger(UserScheduler.name);

  constructor(private readonly orm: MikroORM) {}

  @Timeout(10000)
  // Every weekday at 08:00
  @Cron('0 8 * * 1-5')
  @UseRequestContext()
  private async updateGradeLevels() {
    let updated = 0;

    // Get all of the users with a grade who aren't graduated.
    const [users, count] = await this.orm.em.findAndCount(User, {
      $and: [{ $not: { grade: null } }, { $not: { grade: Grade.GRADUATED } }],
    });

    const now = new Date();
    // If August has not happened this year, use the last year (-1).
    const yearOffset = now.getUTCMonth() < 7 ? -1 : 0;
    // The school year starts on August 1st (in UTC time, whenever that is).
    const schoolYear = new Date(
      Date.UTC(now.getUTCFullYear() + yearOffset, 7, 1),
    );

    for (const user of users) {
      const grade = Math.min(
        Grade.GRADUATED,
        user.grade + differenceInYears(schoolYear, user.gradeSetAt),
      );

      if (user.grade < grade) {
        user.grade = grade;
        updated++;
      }
    }

    await this.orm.em.flush();

    this.logger.log(`Updated ${updated}/${count} user grade levels.`);
  }
}

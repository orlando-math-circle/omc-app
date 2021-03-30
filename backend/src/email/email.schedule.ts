import { MikroORM } from '@mikro-orm/core';
import { UseRequestContext } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PersonalizationData } from '@sendgrid/helpers/classes/personalization';
import { add, format, roundToNearestMinutes } from 'date-fns';
import { Event } from '../event/event.entity';
import { ReminderFreq } from '../user/enums/reminder-freq.enum';
import { User } from '../user/user.entity';
import { Email } from './email.class';
import { EmailService } from './email.service';

type Ranges = {
  [key in ReminderFreq]?: { start: Date; end: Date };
};

@Injectable()
export class EmailScheduler {
  private readonly logger = new Logger(EmailScheduler.name);
  private readonly error = 15; // Margin of error for events (due to scanning every 15 minutes)

  constructor(
    private readonly orm: MikroORM,
    private readonly emailService: EmailService,
  ) {}

  /**
   * The current time rounded to the nearest 15 minutes.
   */
  get now() {
    return roundToNearestMinutes(new Date(), { nearestTo: 15 });
  }

  // @Timeout(5000)
  @Cron('*/15 * * * *')
  @UseRequestContext()
  public async sendEmailReminders() {
    const events = await this.getEvents();
    const map: Map<Event, { freq: ReminderFreq; users: User[] }> = new Map();

    for (const event of events) {
      // No registrations, no emails.
      if (!event.registrations.length) continue;

      const freq: ReminderFreq = this.eventToFrequency(event);

      // If an event has been notified for this type, abort.
      if (event.notified.includes(freq)) continue;

      for (const registration of event.registrations) {
        const user = registration.user;

        // User doesn't want, or can't receive emails.
        if (!user.reminders || !user.email || !user.emailVerified) continue;

        // User didn't want this type of notification.
        if (!user.reminders.includes(freq)) continue;

        // Note that we know here the frequency and the event, so we could make
        // some custom email message, but for now we just want to email them something.
        const mapping = map.get(event);

        if (!mapping) {
          map.set(event, { freq, users: [registration.user] });
        } else {
          mapping.users.push(registration.user);
        }
      }
    }

    await this.sendEmails(map);
  }

  /**
   * Sends emails to each user who has an event.
   *
   * @param map Collection of events and the users to remind
   */
  private async sendEmails(
    map: Map<Event, { freq: ReminderFreq; users: User[] }>,
  ) {
    if (!map.size) {
      this.logger.log('No event notifications to send');
    }

    for (const [event, { freq, users }] of map) {
      const personalizations: PersonalizationData[] = users.map((u) => ({
        to: u.email,
        dynamicTemplateData: {
          name: u.name,
          unsubscribe: 'test',
        },
      }));

      await this.emailService.send(
        new Email(personalizations, 'OMC Event Reminder', {
          templateId: 'd-6544dfe341564100a02cef9cf9ef1842',
          templateData: {
            event: event.name,
            date: format(event.dtstart, 'EEEE, LLLL do, yyyy'),
            time: format(event.dtstart, 'h:mm aaaa'),
            location: event.location,
          },
        }),
      );

      event.notified.push(freq);

      this.logger.log(
        `Event ${event.id} starts at ${format(
          event.dtstart,
          'h:mm aaaa',
        )} on ${format(
          event.dtstart,
          'EEEE, LLLL do, yyyy',
        )} and the users to notify are ${users.map((u) => u.name).join(', ')}`,
      );
    }

    // Save event notification metrics.
    await this.orm.em.flush();
  }

  /**
   * Recreates the query conditions to check which frequency an event falls under.
   * @param event Event
   */
  public eventToFrequency(event: Event) {
    const ranges = this.ranges();

    if (
      event.dtstart >= ranges[ReminderFreq.FIFTEEN].start &&
      event.dtstart < ranges[ReminderFreq.FIFTEEN].end
    ) {
      return ReminderFreq.FIFTEEN;
    } else if (
      event.dtstart >= ranges[ReminderFreq.HOUR].start &&
      event.dtstart < ranges[ReminderFreq.HOUR].end
    ) {
      return ReminderFreq.HOUR;
    } else if (
      event.dtstart >= ranges[ReminderFreq.DAY].start &&
      event.dtstart < ranges[ReminderFreq.DAY].end
    ) {
      return ReminderFreq.DAY;
    }

    return ReminderFreq.WEEK;
  }

  /**
   * Retrives the range of each interval for querying events
   */
  public ranges() {
    const now = this.now;

    const starts: Record<ReminderFreq, Date> = {
      [ReminderFreq.FIFTEEN]: add(now, { minutes: 15 }),
      [ReminderFreq.HOUR]: add(now, { hours: 1 }),
      [ReminderFreq.DAY]: add(now, { days: 1 }),
      [ReminderFreq.WEEK]: add(now, { weeks: 1 }),
    };

    const ranges: Ranges = {};

    for (const key in starts) {
      const start = starts[key];

      ranges[key] = { start: start, end: add(start, { minutes: this.error }) };
    }

    return ranges;
  }

  /**
   * Queries the appropriate date ranges.
   */
  public async getEvents() {
    const ranges = this.ranges();

    return this.orm.em.find(
      Event,
      {
        $or: [
          {
            $and: [
              { dtstart: { $gte: ranges[ReminderFreq.FIFTEEN].start } },
              { dtstart: { $lt: ranges[ReminderFreq.FIFTEEN].end } },
            ],
          },
          {
            $and: [
              { dtstart: { $gte: ranges[ReminderFreq.HOUR].start } },
              { dtstart: { $lt: ranges[ReminderFreq.HOUR].end } },
            ],
          },
          {
            $and: [
              { dtstart: { $gte: ranges[ReminderFreq.DAY].start } },
              { dtstart: { $lt: ranges[ReminderFreq.DAY].end } },
            ],
          },
          {
            $and: [
              { dtstart: { $gte: ranges[ReminderFreq.WEEK].start } },
              { dtstart: { $lt: ranges[ReminderFreq.WEEK].end } },
            ],
          },
        ],
      },
      { populate: ['registrations.user'] },
    );
  }
}

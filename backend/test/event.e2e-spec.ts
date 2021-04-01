import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { addMonths } from 'date-fns';
import Joi from 'joi';
import moment from 'moment';
import RRule, { Frequency } from 'rrule';
import request from 'supertest';
import { AccountModule } from '../src/account/account.module';
import { Roles } from '../src/app.roles';
import { isBeforeDay } from '../src/app.utils';
import { AuthModule } from '../src/auth/auth.module';
import { JsonWebTokenFilter } from '../src/auth/filters/jwt.filter';
import { CourseModule } from '../src/course/course.module';
import { EmailModule } from '../src/email/email.module';
import { CreateEventDto } from '../src/event/dto/create-event.dto';
import { UpdateEventDto } from '../src/event/dto/update-event.dto';
import { UpdateEventsDto } from '../src/event/dto/update-events.dto';
import { EventRecurrence } from '../src/event/event-recurrence.entity';
import { Event } from '../src/event/event.entity';
import { EventModule } from '../src/event/event.module';
import { EventService } from '../src/event/event.service';
import { FileModule } from '../src/file/file.module';
import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';
import { VolunteerJobModule } from '../src/volunteer-job/volunteer-job.module';
import { UserFixtures } from './fixtures/user.fixture';
import { MikroORMTestingConfig } from './mikro-orm.test-config';

describe('Events', () => {
  let app: INestApplication;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  /**
   * Testing Data
   */

  let userFixtures: UserFixtures;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            SECRET: Joi.string().default('test-secret'),
            PAYPAL_SANDBOXED: Joi.boolean().default(true),
            SENDGRID_SANDBOXED: Joi.boolean().default(true),
            FILE_DIRECTORY: Joi.string().default('../../uploads'),
            DEFAULT_EVENT_PICTURE: Joi.string().default(
              '/defaults/neon-math.jpg',
            ),
            DEFAULT_AVATAR_FOLDER: Joi.string().default('/defaults/avatars'),
          }),
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        MikroOrmModule.forRoot(MikroORMTestingConfig),
        EmailModule,
        AccountModule,
        UserModule,
        FileModule,
        AuthModule,
        EventModule,
        CourseModule,
        VolunteerJobModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get<MikroORM>(MikroORM);

    userFixtures = new UserFixtures(app, orm);

    const generator = orm.getSchemaGenerator();
    await generator.ensureDatabase();
    await generator.dropSchema();
    await generator.createSchema();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidUnknownValues: true,
      }),
    );
    app.useGlobalFilters(new JsonWebTokenFilter());

    await app.init();

    /**
     * Seeding Data
     */

    token = await userFixtures.createAccount();
  });

  afterEach(() => {
    orm.em.clear();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe('POST /event', () => {
    it('should throw 401 for unauthenticated users', async () => {
      await request(app.getHttpServer()).post('/event').expect(401);
    });

    it('should throw 403 for unauthorized users', async () => {
      await request(app.getHttpServer())
        .post('/event')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should throw 400 on an invalid request body', async () => {
      const user = await orm.em.findOne(User, { first: 'Jane', last: 'Doe' });

      expect(user).toBeDefined();

      user.roles.push(Roles.ADMIN);

      await orm.em.flush();

      orm.em.clear();

      await request(app.getHttpServer())
        .post('/event')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Event Name', dtend: new Date() })
        .expect(400);
    });

    it('should throw 400 with both a dtstart and rrule', async () => {
      const dto: CreateEventDto = {
        name: 'Title',
        dtstart: new Date(Date.UTC(2020, 11, 24)),
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 11, 24)),
          until: new Date(Date.UTC(2020, 12, 24)),
        },
      };

      await request(app.getHttpServer())
        .post('/event')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(400);
    });

    it('should throw 400 when dtstart is after dtend', async () => {
      const dto: CreateEventDto = {
        name: 'Title',
        dtstart: new Date(Date.UTC(2020, 12, 24)),
        dtend: new Date(Date.UTC(2020, 11, 24)),
      };

      await request(app.getHttpServer())
        .post('/event')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(400);

      const dtoTwo: CreateEventDto = {
        name: 'Title',
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 12, 24)),
          until: new Date(Date.UTC(2020, 11, 24)),
        },
      };

      await request(app.getHttpServer())
        .post('/event')
        .set('Authorization', `Bearer ${token}`)
        .send(dtoTwo)
        .expect(400);
    });

    it('should successfully create non-recurring events', async () => {
      const dto: CreateEventDto = {
        name: 'Test Event',
        dtstart: new Date(Date.UTC(2020, 11, 24)),
        dtend: new Date(Date.UTC(2020, 11, 25)),
      };

      const resp = await request(app.getHttpServer())
        .post('/event')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(resp.body).toBeDefined();
      expect(resp.body.id).toBe(1);
      expect(resp.body.name).toBe(dto.name);
      expect(resp.body.dtstart).toBe(dto.dtstart.toISOString());
    });

    it('should successfully create recurring events with an ending date', async () => {
      const dto: CreateEventDto = {
        name: 'Test Recurring Event',
        dtend: new Date(Date.UTC(2020, 0, 25)),
        rrule: {
          freq: Frequency.WEEKLY,
          dtstart: new Date(Date.UTC(2020, 0, 24, 10, 30)),
          until: new Date(Date.UTC(2020, 1, 24, 12, 0)),
        },
      };

      const resp = await request(app.getHttpServer())
        .post('/event')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(resp.body).toBeDefined();
      expect(resp.body.id).toBe(2);
      expect(resp.body.name).toBe(dto.name);
      expect(resp.body.dtstart).toBe(dto.rrule.dtstart.toISOString());
      expect(resp.body.dtend).toBe(dto.dtend.toISOString());

      const recurrence = await orm.em.findOne(
        EventRecurrence,
        {
          dtstart: dto.rrule.dtstart.toISOString(),
          dtend: dto.rrule.until.toISOString(),
        },
        ['events'],
      );

      const rrule = new RRule(dto.rrule, true).toString();

      expect(recurrence).toBeDefined();
      expect(recurrence.id).toBe(1);
      expect(recurrence.rrule).toBe(rrule);
      expect(recurrence.events.getIdentifiers().includes(2)).toBeTruthy();
      expect(recurrence.dtstart).toStrictEqual(dto.rrule.dtstart);
      expect(recurrence.dtend).toStrictEqual(dto.rrule.until);
    });
  });

  describe('GET /event', () => {
    it('should hydrate events in the given date range', async () => {
      const recurrence = await orm.em.findOne(EventRecurrence, 1, true);
      const dtstart = new Date(Date.UTC(2020, 0, 24, 10, 30));
      const until = new Date(Date.UTC(2020, 1, 24, 12, 0));

      expect(recurrence).toBeDefined();
      expect(recurrence.events.length).toBe(1);

      const resp = await request(app.getHttpServer())
        .get('/event')
        .query({ start: dtstart, end: until })
        .expect(200);

      expect(Array.isArray(resp.body)).toBe(true);
      expect(resp.body.length).toBeGreaterThan(1);

      const isAscending = (resp.body as Event[]).every(
        (e, i) => i === 0 || isBeforeDay(e.dtstart, resp.body[i - 1]),
      );

      expect(isAscending).toBeTruthy();
    });

    it('should not re-create events unnecessarily', async () => {
      const dtstart = new Date(Date.UTC(2020, 0, 24, 10, 30));
      const until = new Date(Date.UTC(2020, 1, 24, 12, 0));
      const events = await orm.em.find(Event, {
        dtstart: { $gte: dtstart },
        dtend: { $lte: until },
        recurrence: { id: 1 },
      });

      expect(events).toBeDefined();
      expect(events.length).toBeTruthy();

      // Ensures no duplicate dates; sets don't allow duplicates.
      const eventDates = events.map((e) => e.start());
      expect(new Set(eventDates).size === eventDates.length).toBeTruthy();

      const length = events.length;

      await request(app.getHttpServer())
        .get('/event')
        .query({ start: dtstart, end: until })
        .expect(200);

      orm.em.clear();

      const eventsAgain = await orm.em.find(Event, {
        dtstart: { $gte: dtstart },
        dtend: { $lte: until },
        recurrence: { id: 1 },
      });

      expect(eventsAgain).toBeDefined();
      expect(eventsAgain.length).toBe(length);

      // Ensures no duplicate dates; sets don't allow duplicates.
      const eventsAgainDates = eventsAgain.map((e) => e.start());
      expect(
        new Set(eventsAgainDates).size === eventsAgainDates.length,
      ).toBeTruthy();
    });
  });

  describe('GET /event/:id', () => {
    it('should retrieve single events', async () => {
      await request(app.getHttpServer()).get('/event/1').expect(200);
    });

    it('should throw on a non-existant event', async () => {
      await request(app.getHttpServer()).get('/event/10').expect(404);
    });
  });

  describe('PATCH /event/:id/single', () => {
    it('should update individual events by exception', async () => {
      const newStart = new Date(Date.UTC(2020, 0, 31, 11, 30));
      const newEnd = new Date(Date.UTC(2020, 0, 31, 20, 0));
      const dto: UpdateEventDto = {
        name: 'Exception Event',
        dtstart: newStart,
        dtend: newEnd,
      };

      const resp = await request(app.getHttpServer())
        .patch('/event/3/single')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.id).toBe(3);
      expect(resp.body.name).toBe('Exception Event');
      expect(resp.body.dtstart).toBe(newStart.toISOString());
      expect(resp.body.originalStart).toBe(
        new Date(Date.UTC(2020, 0, 31, 10, 30)).toISOString(),
      );
      expect(resp.body.dtend).toBe(newEnd.toISOString());
    });

    it('should do nothing else if only updating meta information', async () => {
      const dto: UpdateEventDto = {
        description: 'Update Single',
      };

      await request(app.getHttpServer())
        .patch('/event/3/single')
        .send(dto)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('PATCH /event/:id/future', () => {
    it('should update meta information', async () => {
      const dto: UpdateEventsDto = {
        name: 'Name Change',
        description: 'Test',
        dtend: new Date(Date.UTC(2020, 1, 14, 15, 30)),
      };

      await request(app.getHttpServer())
        .patch('/event/5/future')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);

      const events = await orm.em.find(Event, {
        dtstart: { $gte: new Date(Date.UTC(2020, 1, 7, 10, 30)) },
        dtend: { $lte: new Date(Date.UTC(2020, 1, 21, 15, 30)) },
      });

      expect(events.length).toBe(3);

      for (const event of events) {
        if (event.id < 5) {
          expect(event.name).toBe('Test Recurring Event');
          expect(event.dtend.getUTCHours()).toBe(0);
          expect(event.dtend.getUTCMinutes()).toBe(0);
        } else {
          expect(event.name).toBe('Name Change');
          expect(event.dtend.getUTCHours()).toBe(15);
          expect(event.dtend.getUTCMinutes()).toBe(30);
        }
      }
    });

    it('should add events without recreating them', async () => {
      const dto: UpdateEventsDto = {
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 1, 7, 10, 30)),
          until: new Date(Date.UTC(2020, 1, 21, 12, 0)),
        },
      };

      await request(app.getHttpServer())
        .patch('/event/4/future')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);

      const resp = await request(app.getHttpServer())
        .get('/event')
        .query({ start: dto.rrule.dtstart, end: dto.rrule.until })
        .expect(200);

      for (const event of resp.body as Event[]) {
        if (event.id === 5 || event.id === 6) {
          expect(event.name).toBe('Name Change');
        } else {
          expect(event.name).toBe('Test Recurring Event');
        }
      }
    });

    it('should remove events if there is a gap in the recurrence', async () => {
      // This moves event ID 12 onto where event ID 15 is, events 13-15
      // should be destroyed, not ignored or left on the old recurrence.

      const dto: UpdateEventsDto = {
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 1, 17, 10, 30)),
          until: new Date(Date.UTC(2020, 1, 21, 12, 0)),
        },
      };

      await request(app.getHttpServer())
        .patch('/event/12/future')
        .send(dto)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      await request(app.getHttpServer())
        .get('/event')
        .query({
          start: new Date(Date.UTC(2020, 1, 7, 10, 30)).toUTCString(),
          end: new Date(Date.UTC(2020, 1, 21, 12, 0)),
        })
        .expect(200);
    });

    it('should perform an all-events update if necessary', async () => {
      const spy = jest.spyOn<any, any>(EventService.prototype, 'setEventData');

      const dto: UpdateEventsDto = {
        name: 'Recurring Event',
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 1, 7, 10, 30)),
          until: new Date(Date.UTC(2020, 1, 28, 12, 0)),
        },
      };

      await request(app.getHttpServer())
        .patch('/event/4/future')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not reset a count in a recurrence split', async () => {
      const dto: CreateEventDto = {
        name: 'Count Split Test',
        dtend: new Date(Date.UTC(2020, 11, 10, 5, 0)),
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 11, 10, 0, 0)),
          count: 5,
        },
      };

      await request(app.getHttpServer())
        .post('/event')
        .send(dto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const resp = await request(app.getHttpServer())
        .get('/event')
        .query({
          start: dto.rrule.dtstart,
          end: moment(dto.rrule.dtstart).add(5, 'days').toDate(),
        })
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(Array.isArray(resp.body)).toBeTruthy();
      expect(resp.body.length).toBe(5);

      const secondDto: UpdateEventsDto = {
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 11, 20)),
          count: 5,
        },
      };

      await request(app.getHttpServer())
        .patch('/event/21/future')
        .send(secondDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      await request(app.getHttpServer())
        .get('/event')
        .query({
          start: secondDto.rrule.dtstart,
          end: moment(secondDto.rrule.dtstart).add(5, 'days').toDate(),
        })
        .expect(200);

      const recurrence = await orm.em.findOne(EventRecurrence, 5, ['events']);

      expect(recurrence).toBeDefined();
      expect(recurrence.events.length).toBe(3);
      expect(recurrence.rrule.includes('COUNT=3')).toBeTruthy();
    });

    it('should remove an orphaned recurrence', async () => {
      const dto: CreateEventDto = {
        name: 'Orphan Recurrence Test',
        dtend: new Date(Date.UTC(2020, 6, 1, 10)),
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 6, 1)),
          count: 5,
        },
      };

      await request(app.getHttpServer())
        .post('/event')
        .send(dto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const resp = await request(app.getHttpServer())
        .get('/event')
        .query({
          start: dto.rrule.dtstart,
          end: moment(dto.rrule.dtstart).add(5, 'days').toDate(),
        })
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(Array.isArray(resp.body)).toBeTruthy();
      expect(resp.body.length).toBe(5);

      const first = resp.body[0].id;
      const recurrence = await orm.em.findOneOrFail(
        EventRecurrence,
        {
          events: { id: first },
        },
        { populate: ['events'] },
      );

      expect(recurrence).toBeDefined();
      expect(recurrence.events.length).toBe(5);

      const eventIds = [...recurrence.events.getIdentifiers()];
      orm.em.clear();

      const secondDto: UpdateEventsDto = {
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 7, 1)),
          count: 5,
        },
      };

      await request(app.getHttpServer())
        .patch(`/event/${first}/future`)
        .send(secondDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const recurrenceAfter = await orm.em.findOneOrFail(
        EventRecurrence,
        recurrence.id,
        {
          populate: ['events'],
        },
      );

      const newIdentifiers = recurrenceAfter.events.getIdentifiers();
      expect(newIdentifiers.length).toBeTruthy();
      expect(newIdentifiers.every((id) => !eventIds.includes(id))).toBeTruthy();
    });
  });

  describe('PATCH /event/:id/all', () => {
    it('should update all events, regardless of the event id', async () => {
      const dto: UpdateEventsDto = {
        name: 'All Events',
      };

      await request(app.getHttpServer())
        .patch('/event/10/all')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);

      const events = await orm.em.find(Event, { recurrence: { id: 2 } });

      for (const event of events) {
        expect(event.name).toBe('All Events');
      }
    });

    it('should overwrite the existing recurrence rule', async () => {
      const dto: UpdateEventsDto = {
        rrule: {
          freq: Frequency.WEEKLY,
          dtstart: new Date(Date.UTC(2020, 1, 7, 10, 30)),
          until: new Date(Date.UTC(2020, 1, 21, 12, 0)),
        },
      };

      const rrule = await orm.em.findOne(EventRecurrence, 2);

      expect(rrule).toBeDefined();

      await request(app.getHttpServer())
        .patch('/event/8/all')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);

      await request(app.getHttpServer())
        .get('/event')
        .query({
          start: new Date(Date.UTC(2020, 1, 7, 10, 30)).toUTCString(),
          end: new Date(Date.UTC(2020, 1, 21, 12, 0)),
        })
        .expect(200);

      orm.em.clear();

      const rruleAfter = await orm.em.findOne(EventRecurrence, 2);

      expect(rruleAfter).toBeDefined();
      expect(rruleAfter.rrule).toEqual(
        'DTSTART:20200207T103000Z\nRRULE:FREQ=WEEKLY;UNTIL=20200221T120000Z',
      );
    });

    it('should reset an exception if dtstart > dtend > originalStart', async () => {
      const dto: UpdateEventDto = {
        dtstart: new Date(Date.UTC(2020, 1, 19, 5, 0)),
        dtend: new Date(Date.UTC(2020, 1, 19, 10, 0)),
      };

      await request(app.getHttpServer())
        .patch('/event/16/single/')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200);

      const dtoTwo: UpdateEventsDto = {
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 1, 17, 10, 0)),
          until: new Date(Date.UTC(2020, 1, 21, 12, 0)),
        },
      };

      await request(app.getHttpServer())
        .patch('/event/12/all')
        .set('Authorization', `Bearer ${token}`)
        .send(dtoTwo)
        .expect(200);

      const event = await orm.em.findOne(Event, 16);

      expect(event).toBeDefined();
      expect(event.id).toBe(16);
      expect(event.originalStart).toBe(null);
    });
  });

  describe('DELETE /event/:id/single', () => {
    it('should not re-create the event again', async () => {
      await request(app.getHttpServer())
        .delete('/event/17/single')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const resp = await request(app.getHttpServer())
        .get('/event')
        .query({
          start: new Date(Date.UTC(2020, 1, 19, 10, 30)),
          end: new Date(Date.UTC(2020, 1, 20, 0, 0)),
        })
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(Array.isArray(resp.body)).toBeTruthy();
      expect(resp.body.length).toBe(0);
    });

    it('should return 404 on a subsequent deletion', async () => {
      await request(app.getHttpServer())
        .delete('/event/17/single')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('DELETE /event/:id/future', () => {
    it('should delete events and prevent their re-creation', async () => {
      const dto: CreateEventDto = {
        name: 'Deleting Future Recurrences',
        dtend: new Date(Date.UTC(2020, 10, 10, 3, 0)),
        rrule: {
          freq: Frequency.DAILY,
          dtstart: new Date(Date.UTC(2020, 10, 10, 2, 30)),
          until: new Date(Date.UTC(2020, 10, 20, 3, 0)),
        },
      };

      await request(app.getHttpServer())
        .post('/event')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      await request(app.getHttpServer())
        .get('/event')
        .query({
          start: dto.rrule.dtstart,
          end: dto.rrule.until,
        })
        .expect(200);

      const events = await orm.em.find(Event, {
        dtstart: { $gte: dto.rrule.dtstart },
        dtend: { $lte: dto.rrule.until },
      });

      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBeTruthy();
      expect(events.length).toBe(11);

      await request(app.getHttpServer())
        .delete(`/event/${events[2].id}/future`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      orm.em.clear();

      const remainingEvents = await orm.em.find(Event, {
        dtstart: { $gte: dto.rrule.dtstart },
        dtend: { $lte: dto.rrule.until },
      });

      expect(remainingEvents).toBeDefined();
      expect(Array.isArray(remainingEvents)).toBeTruthy();
      expect(remainingEvents.length).toBe(2);
    });

    it('should pivot to deleting all events if the first instance is selected', async () => {
      const recurrence = await orm.em.findOne(EventRecurrence, 5, ['events']);

      expect(recurrence).toBeDefined();
      expect(recurrence.events.length).toBe(3);

      const eventId = recurrence.events.getIdentifiers();

      await request(app.getHttpServer())
        .delete('/event/21/future')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      orm.em.clear();

      const recurrenceAfter = await orm.em.findOne(EventRecurrence, 5);

      expect(recurrenceAfter).toBeFalsy();

      const events = await orm.em.find(Event, { id: { $in: eventId } });

      expect(events.length).toBe(0);
    });
  });

  describe('DELETE /event/:id/all', () => {
    it('should remove all events and the recurrence', async () => {
      const recurrence = await orm.em.findOne(EventRecurrence, 3, ['events']);

      expect(recurrence).toBeDefined();

      const eventIds = recurrence.events.getIdentifiers();

      await request(app.getHttpServer())
        .delete('/event/16/all')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      orm.em.clear();

      const recurrenceAfter = await orm.em.findOne(EventRecurrence, 3);

      expect(recurrenceAfter).toBeFalsy();

      const events = await orm.em.find(Event, { id: { $in: eventIds } });

      expect(events.length).toBe(0);
    });
  });

  describe('Event Hydration', () => {
    it('should hydrate events outside of the range', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Extended Range',
        dtend: new Date(Date.UTC(2020, 0, 1, 10, 30)),
        rrule: {
          freq: Frequency.WEEKLY,
          dtstart: new Date(Date.UTC(2020, 0, 1)),
          until: addMonths(new Date(Date.UTC(2020, 0, 1)), 4),
        },
      };

      await request(app.getHttpServer())
        .post('/event')
        .send(createEventDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const [, count] = await orm.em.findAndCount(Event, {
        name: 'Extended Range',
      });

      expect(count).toBe(1);

      const start = new Date(Date.UTC(2020, 2, 1));
      const end = new Date(Date.UTC(2020, 3, 1));

      const events = await request(app.getHttpServer())
        .get('/event')
        .query({ start, end })
        .expect(200);

      expect(events.body.length).toBe(4);

      for (const event of events.body) {
        expect(event.dtstart).not.toBe(
          createEventDto.rrule.dtstart.toISOString(),
        );
      }
    });
  });

  describe('Post-Test Scanning', () => {
    it('should not have created any events where dtstart > dtend', async () => {
      const events = await orm.em.find(Event, {});

      expect(
        events.every((e) => !e.dtend || +e.dtstart < +e.dtend),
      ).toBeTruthy();
    });
  });
});

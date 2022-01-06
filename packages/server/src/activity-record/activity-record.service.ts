import {
  AnyEntity,
  EntityName,
  FilterQuery,
  FindOneOrFailOptions,
  FindOptions,
  Loaded,
  Populate,
} from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { EventRegistration } from '../event-registration/event-registration.entity';
import { Event } from '../event/event.entity';
import { ActivityRecord } from './activity-record.entity';
import { CreateActivityRecordDto } from './dto/create-activity-record.dto';
import { ActivityRecordEvent } from './enums/activity-record-event.enum';

/**
 * Activity Record Service
 *
 * A service for generating records when administrative actions
 * are performed. The design is modeled after the Discord audit
 * logging system, though to a reduced degree.
 *
 * @see https://discord.com/developers/docs/resources/audit-log
 *
 */

@Injectable()
export class ActivityRecordService {
  constructor(private readonly em: SqlEntityManager) {}

  /**
   * Creates an entry in the activity record based on the user and the role.
   *
   * @param dto Properties of the primary user.
   */
  async create({ type, userId, targetId, changes }: CreateActivityRecordDto) {
    const entry = new ActivityRecord(
      type,
      userId,
      targetId,
      ...(changes || []),
    );

    await this.em.persist(entry).flush();

    return entry;
  }

  /**
   * Find a single activity record.
   *
   * @param where - Filter query.
   * @param options - FindOneOrFailOptions.
   */
  public async findOne(
    where: FilterQuery<ActivityRecord>,
    options?: FindOneOrFailOptions<ActivityRecord>,
  ) {
    const record = await this.em.findOneOrFail(ActivityRecord, where, options);

    return this.getRecordAssociations(record);
  }

  /**
   * Finds activity records and the resources they reference.
   *
   * @param where Filter query.
   * @param options Find options.
   */
  public async findAll(
    where: FilterQuery<ActivityRecord>,
    options?: FindOptions<ActivityRecord>,
  ) {
    // Unless otherwise specified, we want the newest records first.
    options = {
      orderBy: { id: 'DESC' },
      ...options,
    };

    const [records, count] = await this.em.findAndCount(
      ActivityRecord,
      where,
      options,
    );

    return {
      ...(await this.getRecordAssociations(...records)),
      count,
    };
  }

  /**
   * Loads an entity and populates it with the given associations
   * inside a map record if it doesn't already exist.
   *
   * @param entity Entity to retrieve for the record.
   * @param where Filter query.
   * @param map Map to store the entity in.
   * @param populate Associations to populate.
   */
  private async getRecordEntity<T extends AnyEntity<T>, P extends Populate<T>>(
    entity: EntityName<T>,
    where: FilterQuery<T>,
    map: Map<FilterQuery<T>, Loaded<T, P> | null>,
    populate?: P,
  ) {
    if (!map.has(where)) {
      map.set(where, await this.em.findOne(entity, where, { populate }));
    }
  }

  /**
   * Provided an array of records, this method will load the related
   * entities found in the records and return arrays of these associations.
   *
   * @param records Activity records.
   */
  private async getRecordAssociations(...records: ActivityRecord[]) {
    const users = new Map<number, User | null>();
    const events = new Map<number, Event | null>();
    const registrations = new Map<number, EventRegistration | null>();

    const promises = [];

    for (const record of records) {
      // Actor who did the action.
      if (record.userId) {
        promises.push(this.getRecordEntity(User, +record.userId, users));
      }

      // Target of the action.
      if (record.targetId) {
        const id = parseInt(record.targetId);

        switch (record.type) {
          case ActivityRecordEvent.EMAIL_ACCOUNT_CREATE:
            promises.push(this.getRecordEntity(User, id, users));
          case ActivityRecordEvent.EVENT_CREATE:
          case ActivityRecordEvent.EVENT_UPDATE:
            promises.push(this.getRecordEntity(Event, id, events));
          case ActivityRecordEvent.VOLUNTEER_SWAP_REQUEST:
          case ActivityRecordEvent.VOLUNTEER_SWAP_COMPLETE:
            promises.push(
              this.getRecordEntity(EventRegistration, id, registrations, [
                'event',
              ]),
            );
        }
      }

      // Changes of target.
      if (record.changes) {
        switch (record.type) {
          case ActivityRecordEvent.VOLUNTEER_SWAP_COMPLETE:
            if (record.changes[0].oldValue) {
              const id = parseInt(record.changes[0].oldValue);

              promises.push(this.getRecordEntity(User, id, users));
            }
        }
      }
    }

    await Promise.all(promises);

    return {
      records,
      users: Array.from(users.values()).filter((u) => u !== null),
      events: Array.from(events.values()).filter((e) => e !== null),
      registrations: Array.from(registrations.values()).filter(
        (r) => r !== null,
      ),
    };
  }
}

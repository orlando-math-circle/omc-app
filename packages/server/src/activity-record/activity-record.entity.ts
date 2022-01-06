import { AnyEntity, Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { isNumber, isString } from '@omc/shared';
import { User } from '../user/user.entity';
import { ActivityRecordChangeDto } from './dto/activity-record-change.dto';
import { ActivityRecordEvent } from './enums/activity-record-event.enum';

@Entity()
export class ActivityRecord {
  @PrimaryKey()
  id!: number;

  /**
   * Categorical classification of the changes made.
   */
  @Enum(() => ActivityRecordEvent)
  type!: ActivityRecordEvent;

  /**
   * The actioner of the changes.
   * If null, the system acted autonomously.
   */
  @Property({ nullable: true })
  userId?: string;

  /**
   * The entity that was acted upon, if applicable.
   */
  @Property({ nullable: true })
  targetId?: string;

  @Property({ nullable: true, type: 'json' })
  changes?: ActivityRecordChangeDto[];

  @Property()
  createdAt: Date = new Date();

  constructor(
    type: ActivityRecordEvent,
    userId?: string | number | User,
    targetId?: string | number | AnyEntity,
    ...changes: ActivityRecordChangeDto[]
  ) {
    this.type = type;

    this.userId =
      typeof userId === 'number'
        ? userId.toString()
        : userId instanceof User
        ? userId.id.toString()
        : userId;

    this.targetId =
      typeof targetId === 'number'
        ? targetId.toString()
        : typeof targetId === 'object' && targetId.hasOwnProperty('id')
        ? targetId.id.toString()
        : targetId;

    this.changes = changes;
  }

  /**
   * Sets the initiator of the changes.
   *
   * @param user Identifier or object of the user.
   */
  public setActor(user: number | string | User) {
    if (isString(user)) {
      this.userId = user;
    } else if (isNumber(user)) {
      this.userId = user.toString();
    } else {
      this.userId = user.id.toString();
    }

    return this;
  }

  /**
   * Set the entity that was acted upon.
   *
   * @param target Identifier or object of the entity.
   */
  public setTarget(target: number | string | AnyEntity) {
    if (isString(target)) {
      this.targetId = target;
    } else if (isNumber(target)) {
      this.targetId = target.toString();
    } else {
      this.targetId = target.id.toString();
    }

    return this;
  }
}

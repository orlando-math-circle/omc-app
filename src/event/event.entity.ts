import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EventRecurrence } from '../event-recurrence/event-recurrence.entity';
import { User } from '../user/user.entity';

@Entity()
export class Event extends BaseEntity<Event, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  picture?: string;

  @Property({ nullable: true })
  color?: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Timing Data
   */

  @Property()
  dtstart!: Date;

  @Property({ nullable: true })
  dtend?: Date;

  @Property({ nullable: true })
  originalStart?: Date;

  /**
   * Relationships
   */

  @ManyToOne(() => EventRecurrence, { nullable: true, hidden: true })
  recurrence?: EventRecurrence;

  @ManyToOne(() => User)
  author!: User;

  // project?: Project;

  // registrations?: EventRegistration[];
}

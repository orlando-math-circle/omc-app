import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { Event } from '../event/event.entity';
import { User } from '../user/user.entity';

@Entity()
@Unique({ properties: ['event', 'user'] })
export class EventRegistration extends BaseEntity<EventRegistration, 'id'> {
  @PrimaryKey()
  id!: number;

  /**
   * Relationships
   */

  @ManyToOne(() => Event, { eager: false })
  event!: Event;

  @ManyToOne(() => User)
  user!: User;
}

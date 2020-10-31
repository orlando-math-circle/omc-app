import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Course } from '../course/course.entity';
import { Event } from '../event/event.entity';

@Entity()
export class Project extends BaseEntity<Project, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  picture?: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationships
   */

  @OneToMany(() => Course, (c) => c.project)
  courses = new Collection<Course>(this);

  @OneToMany(() => Event, (e) => e.project)
  events = new Collection<Event>(this);
}

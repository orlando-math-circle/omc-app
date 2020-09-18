import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Course } from '../course/course.entity';

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

  /**
   * Relationships
   */

  @OneToMany(() => Course, (c) => c.project)
  courses = new Collection<Course>(this);
}

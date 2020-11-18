import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Project } from '../project/project.entity';

@Entity()
export class VolunteerJob extends BaseEntity<VolunteerJob, 'id'> {
  constructor(name: string, hours: number, description?: string) {
    super();
    this.name = name;
    this.hours = hours;
    this.description = description;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  hours!: number;

  @Property({ nullable: true })
  description?: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationships
   */

  @ManyToOne(() => Project)
  project!: Project;
}

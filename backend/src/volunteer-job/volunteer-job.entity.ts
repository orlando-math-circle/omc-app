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
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  hours!: number;

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

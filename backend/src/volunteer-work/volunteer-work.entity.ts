import {
  BaseEntity,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { VolunteerWorkStatus } from './enums/work-status.enum';

@Entity()
export class VolunteerWork extends BaseEntity<VolunteerWork, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  hours!: number;

  @Enum(() => VolunteerWorkStatus)
  status: VolunteerWorkStatus;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Relationship
   */

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Project, { nullable: true })
  project?: Project;
}

import { Embeddable, Property } from '@mikro-orm/core';
import { EventPermissionsDto, User } from '..';

@Embeddable()
export class EventMetadata {
  @Property()
  name!: string;

  @Property({ nullable: true, columnType: 'text' })
  description?: string;

  @Property({ nullable: true })
  location?: string;

  @Property()
  locationTitle!: string;

  @Property()
  picture!: string;

  @Property({ nullable: true })
  color?: string;

  @Property({ nullable: true })
  permissions?: EventPermissionsDto;

  @Property({ nullable: true })
  points?: number = 0;

  hasPermission(user: User) {
    if (!this.permissions) {
      return true;
    }

    const { grades, genders, membershipStatus } = this.permissions;

    if (genders && !genders.includes(user.gender)) return false;

    if (grades && user.grade && !grades.includes(user.grade)) return false;

    if (membershipStatus && !user.isMember) return false;

    return true;
  }
}

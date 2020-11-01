import {
  ArrayType,
  BaseEntity,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Account } from '../account/account.entity';
import { Roles } from '../app.roles';
import { birthdayToAge, getYearsDiff } from '../app.utils';
import { EventRegistration } from '../event-registration/event-registration.entity';
import { FileAttachment } from '../file-attachment/file-attachment.entity';
import { File } from '../file/file.entity';
import { Invoice } from '../invoice/invoice.entity';
import { Grades } from './enums/grades.enum';

@Entity()
export class User extends BaseEntity<User, 'id'> {
  @PrimaryKey()
  id!: number;

  @Property()
  first!: string;

  @Property()
  last!: string;

  @Property()
  dob!: Date;

  @Property({ nullable: true, unique: true })
  email?: string;

  @Property({ nullable: true })
  emailVerified?: boolean;

  @Property({ nullable: true, hidden: true })
  password?: string;

  @Property({ type: ArrayType })
  roles: Roles[] = [];

  @Property({ default: false })
  feeWaived: boolean = false;

  @Enum({ type: () => Grades, nullable: true })
  gradeSet?: Grades;

  @Property({ nullable: true })
  gradeSetAt?: Date = new Date();

  @Property({ nullable: true })
  avatar?: string;

  @Property({ default: false })
  locked: boolean = false;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  /**
   * Computed Properties
   */

  @Property({ persist: false })
  get grade() {
    if (!this.gradeSet) return null;

    const now = new Date();
    // If August has not happened this year, the current
    // school year is in the last year.
    const yearOffset = now.getUTCMonth() < 7 ? -1 : 0;
    // The current school year is the threshold of August 1st.
    const currentSchoolYear = new Date(now.getUTCFullYear() + yearOffset, 7, 1);

    return Math.min(
      Grades.GRADUATED,
      this.gradeSet + getYearsDiff(this.gradeSetAt, currentSchoolYear),
    );
  }

  set grade(grade: Grades) {
    this.gradeSet = grade;
  }

  @Property({ persist: false })
  get name() {
    return `${this.first} ${this.last}`;
  }

  /**
   * This may be quite a few hours off. The frontend will assume their
   * birthday is 12:00 AM on that day in their time zone.
   */
  @Property({ persist: false })
  get age() {
    return birthdayToAge(this.dob);
  }

  /**
   * Relationships
   */

  // Intentionally hidden as serializing an account entity causes
  // a circular JSON structure when it reaches this property.
  @ManyToOne(() => Account, { hidden: true })
  account!: Account;

  @OneToMany(() => EventRegistration, (r) => r.user, { eager: false })
  registrations = new Collection<EventRegistration>(this);

  @OneToMany(() => Invoice, (i) => i.user, { eager: false })
  invoices = new Collection<Invoice>(this);

  @OneToMany(() => File, (f) => f.author)
  files = new Collection<File>(this);

  @OneToMany(() => FileAttachment, (a) => a.user)
  attachments = new Collection<FileAttachment>(this);
}

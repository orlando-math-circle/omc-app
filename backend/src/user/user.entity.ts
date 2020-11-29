import {
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
import { birthdayToAge } from '../app.utils';
import { EventRegistration } from '../event-registration/event-registration.entity';
import { FileAttachment } from '../file-attachment/file-attachment.entity';
import { File } from '../file/file.entity';
import { Invoice } from '../invoice/invoice.entity';
import { IndustryDto } from './dtos/industry.dto';
import { Gender } from './enums/gender.enum';
import { Grade } from './enums/grade.enum';
import { ReminderFreq } from './enums/reminder-freq.enum';

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

  @Enum(() => Gender)
  gender!: Gender;

  @Property({ nullable: true, unique: true })
  email?: string;

  @Property({ nullable: true })
  omcEmail?: string;

  @Property({ nullable: true })
  emailVerified?: boolean;

  @Property({ nullable: true, hidden: true })
  password?: string;

  @Enum({ items: () => Roles, array: true, default: [Roles.DEFAULT] })
  roles: Roles[] = [Roles.DEFAULT];

  @Property({ default: false })
  feeWaived: boolean = false;

  @Enum({ type: () => Grade, nullable: true })
  grade?: Grade;

  @Property({ nullable: true })
  gradeSetAt?: Date = new Date();

  @Property({ nullable: true })
  avatar?: string;

  @Enum({
    type: () => ReminderFreq,
    array: true,
    nullable: true,
  })
  reminders?: ReminderFreq[];

  @Property({ nullable: true })
  industry?: IndustryDto;

  @Property({ default: false })
  locked: boolean = false;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

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

  @OneToMany(() => EventRegistration, (r) => r.user, {
    eager: false,
    orphanRemoval: true,
  })
  registrations = new Collection<EventRegistration>(this);

  @OneToMany(() => Invoice, (i) => i.user, { eager: false })
  invoices = new Collection<Invoice>(this);

  @OneToMany(() => File, (f) => f.author, { orphanRemoval: true })
  files = new Collection<File>(this);

  @OneToMany(() => FileAttachment, (a) => a.user, { orphanRemoval: true })
  attachments = new Collection<FileAttachment>(this);
}

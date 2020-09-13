import { BaseEntity, Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { NotFoundException } from '@nestjs/common';
import { Account } from '../src/account/account.entity';
import { EventRegistration } from '../src/event-registration/event-registration.entity';
import { EventRecurrence } from '../src/event/event-recurrence.entity';
import { Event } from '../src/event/event.entity';
import { Invoice } from '../src/invoice/invoice.entity';
import { User } from '../src/user/user.entity';

export const MikroORMTestingConfig: Options = {
  type: 'postgresql',
  entities: [
    BaseEntity,
    Account,
    User,
    Event,
    EventRecurrence,
    EventRegistration,
    Invoice,
  ],
  dbName: process.env.TESTING_DATABASE_NAME || 'omc_test',
  user: process.env.TESTING_DATABASE_USER || 'postgres',
  findOneOrFailHandler: (entityName: string) => {
    return new NotFoundException(`${entityName} not found`);
  },
  forceUtcTimezone: true,
  debug: process.env.TESTING_DEBUG === 'true',
  highlighter: new SqlHighlighter(),
};

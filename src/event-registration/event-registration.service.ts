import { EventRegistration } from './event-registration.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

export class EventRegistrationService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly repository: EntityRepository<EventRegistration>,
  ) {}
}

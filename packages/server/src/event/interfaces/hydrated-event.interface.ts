import { Event } from '../event.entity';

export type HydratedEvent = Omit<Event, 'id' | 'rrule'>;

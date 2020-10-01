import { Event } from '../../backend/src/event/event.entity'

export interface CalendarEvent extends Omit<Event, 'start'> {
  start: string
  end?: string
}

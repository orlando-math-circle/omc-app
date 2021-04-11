import { Event } from '@server/event/event.entity'

export interface CalendarEvent extends Omit<Event, 'start'> {
  start: string
  end?: string
}

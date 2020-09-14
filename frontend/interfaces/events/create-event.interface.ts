import { EventRecurrenceDto } from './event-recurrence.interface'

export interface CreateEventDto {
  name: string
  description?: string
  picture?: string
  color?: string
  dtstart?: Date
  dtend?: Date
  rrule?: EventRecurrenceDto
}

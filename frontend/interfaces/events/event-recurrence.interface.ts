import { Frequency, ByWeekday } from 'rrule'

export interface EventRecurrenceDto {
  freq: Frequency
  dtstart: Date
  until?: Date
  interval?: number
  count?: number
  bysetpos?: number | number[]
  byweekday?: ByWeekday | ByWeekday[]
}

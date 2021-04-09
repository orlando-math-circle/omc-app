import { Frequency, ByWeekday, Options } from 'rrule'

export interface EventRecurrenceOptions {
  interval: number
  freq: Frequency
  dtstart: string
  until: string
  count: number
  byweekday: ByWeekday[]
  bysetpos: number
  bymonthday: number
}

export interface RRuleOptions extends Partial<Options> {
  [index: string]: any
}

export interface RecurrenceDtoBase {
  interval?: number
  freq: Frequency
  dtstart: string
  until?: string
  count?: number
  byweekday?: ByWeekday[]
  bysetpos?: number
  bymonthday?: number
}

export interface CountRecurrenceDto extends RecurrenceDtoBase {
  count: number
}

export interface UntilRecurrenceDto extends RecurrenceDtoBase {
  until: string
}

export type EventRecurrenceDto = CountRecurrenceDto | UntilRecurrenceDto

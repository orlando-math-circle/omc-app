import { CalendarTimestamp } from 'vuetify'

export type CalendarType = 'simple' | 'month' | 'week' | 'day' | '4day'

export interface VCalendar {
  checkChange: () => void
  move: (amount?: number) => void
  next: (amount?: number) => void
  prev: (amount?: number) => void
}

export interface VCalendarChange {
  start: CalendarTimestamp
  end: CalendarTimestamp
}

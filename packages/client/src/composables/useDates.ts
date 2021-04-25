import {
  format,
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  isSameDay,
} from 'date-fns'

type DateTime = Date | string

export const useDates = () => {
  const toDate = (date: DateTime) =>
    typeof date === 'string' ? parseISO(date) : date

  const utils = {
    toDate: (date: DateTime) => toDate(date),
    format: (date: DateTime, formatString: string) =>
      format(toDate(date), formatString),
    addDays: (date: DateTime, amount: number) => addDays(toDate(date), amount),
    startOfDay: (date: DateTime) => startOfDay(toDate(date)),
    endOfDay: (date: DateTime) => endOfDay(toDate(date)),
    startOfWeek: (date: DateTime) => startOfWeek(toDate(date)),
    endOfWeek: (date: DateTime, andDay = true) =>
      endOfWeek(andDay ? utils.endOfDay(toDate(date)) : toDate(date)),
    startOfMonth: (date: DateTime) => startOfMonth(toDate(date)),
    endOfMonth: (date: DateTime, andDay = true) =>
      endOfMonth(andDay ? utils.endOfDay(toDate(date)) : toDate(date)),
    isSameDay: (first: DateTime, second: DateTime) =>
      isSameDay(toDate(first), toDate(second)),
  }

  return { ...utils }
}

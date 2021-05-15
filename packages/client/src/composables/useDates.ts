import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

type DateTime = Date | string

export const useDates = () => {
  const toDate = (date: DateTime) =>
    typeof date === 'string' ? parseISO(date) : date

  const utils = {
    toDate: (date: DateTime) => toDate(date),
    addDays: (date: DateTime, amount: number) => addDays(toDate(date), amount),
    startOfDay: (date: DateTime) => startOfDay(toDate(date)),
    endOfDay: (date: DateTime) => endOfDay(toDate(date)),
    startOfWeek: (date: DateTime) => startOfWeek(toDate(date)),
    endOfWeek: (date: DateTime, andDay = true) =>
      endOfWeek(andDay ? utils.endOfDay(toDate(date)) : toDate(date)),
    startOfMonth: (date: DateTime) => startOfMonth(toDate(date)),
    endOfMonth: (date: DateTime, andDay = true) =>
      endOfMonth(andDay ? utils.endOfDay(toDate(date)) : toDate(date)),
  }

  return { ...utils }
}

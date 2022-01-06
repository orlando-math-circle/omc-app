import { parseISO, endOfDay } from 'date-fns'
import { isDate } from '.'

export const fromISO = (iso: string) => {
  return parseISO(iso)
}

export const toDate = (isoOrDate: string | Date) => {
  if (isDate(isoOrDate)) {
    return isoOrDate
  }

  return new Date(isoOrDate)
}

export { endOfDay }

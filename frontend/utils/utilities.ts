import { AxiosError } from 'axios'
import { format, parse } from 'date-fns'
import { StateError } from '../interfaces/state-error.interface'

/**
 * Parses an Axios error to avoid cyclic dependency
 * errors in Vuex.
 *
 * @param error Axios error.
 */
export const parseAxiosError = (error: AxiosError): StateError => {
  if (error.response) {
    return {
      url: error.config.url,
      status: error.response.status,
      message: error.message,
    }
  }

  return { message: error.message }
}

/**
 * Formats a date or ISO date string as a friendly readable date.
 *
 * @see https://date-fns.org/v2.16.1/docs/format
 *
 * @param d Date object or ISO date string.
 * @param formatString Date-fns format string.
 */
export const formatDate = (d: string | Date, formatString: string) => {
  const date = typeof d === 'string' ? new Date(d) : d

  return format(date, formatString)
}

/**
 * Method for quickly obtaining the ordinal suffix of a number
 * so long as the number isn't negative.
 *
 * @see https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
 *
 * @param i Positive number
 */
export const getOrdinal = (i: number) =>
  ['', 'st', 'nd', 'rd'][(i / 10) % 10 ^ 1 && i % 10] || 'th'

/**
 * Given an input object, determines if the `isAxiosError`
 * property is present on Axios-related errors and a response
 * was not found. This is indicative of some kind of network or
 * timeout error.
 *
 * @param error Axios error.
 */
export const isNetworkError = (error: any) =>
  !!error.isAxiosError && !error.response

/**
 * Returns if the parameter is a Date instance and if
 * the date is created correctly and has a time representation.
 *
 * @param d Object to check.
 */
export const isValidDate = (d: any): d is Date =>
  d instanceof Date && !isNaN(d.getTime())

/**
 * Takes a date string in ISO format and optionally the
 * 24-hour time to create a date.
 *
 * @param date Date string in ISO format, e.g. 2020-01-06.
 * @param date Optional time string in 24-hour ISO format, e.g. 03:28.
 */
export const toDate = (dateString: string, timeString?: string) => {
  if (!timeString) {
    return parse(dateString, 'yyyy-MM-dd', new Date())
  } else {
    return parse(`${dateString}-${timeString}`, 'yyyy-MM-dd-HH:mm', new Date())
  }
}

/**
 * Creates a new Date instance by rounding it by a specified
 * number of minutes.
 *
 * @param seed Date to round, if not present, uses now.
 * @param minutes Number of minutes to round by, default 5.
 */
export const roundDate = (seed = new Date(), minutes = 5) => {
  const milliseconds = 1000 * 60 * minutes

  return new Date(Math.ceil(seed.getTime() / milliseconds) * milliseconds)
}

/**
 * TODO: Write out what this does without rambling.
 */
export const toLocalISO = (d: Date | string) => {
  const date = isValidDate(d) ? d : new Date(d)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)

  return localDate.toISOString().substr(0, 16)
}

/**
 * Given an hour and minute ISO format, add a given number of hours
 * and minutes to it. This returns the hh:mm format.
 *
 * @param time ISO time string.
 * @param hours Number of hours to add.
 * @param Minutes Number of minutes to add.
 */
export const addTime = (time: string, hours = 0, minutes = 0) => {
  const [hour, minute] = time.split(':')
  const date = new Date()
  date.setHours(+hour + hours)
  date.setMinutes(+minute + minutes)

  return format(date, 'HH:mm')
}

/**
 * Converts an ISO time into the representational number of
 * milliseconds it represents.
 *
 * @param time ISO time string.
 */
export const getTimeValue = (time: string) => {
  const now = new Date()

  return parse(time, 'HH:mm', now).getTime() - now.getTime()
}

/**
 * Converts a 24-hour ISO time string into a friendlier time format
 * e.g. 23:00 -> 11:00 PM
 *
 * @param time ISO time string.
 */
export const friendlyTime = (time: string) => {
  const date = parse(time, 'HH:mm', new Date())

  return format(date, 'p')
}

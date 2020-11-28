import { AxiosError } from 'axios'
import { format, parse } from 'date-fns'
import { isArray, isEqual, isObject, transform } from 'lodash'
import { StateError } from '../interfaces/state-error.interface'

/**
 * Find difference between two objects.
 * Source: https://davidwells.io/snippets/get-difference-between-two-objects-javascript
 *
 * @param origObj Source object to compare newObj against
 * @param newObj New object with potential changes
 * @return differences
 */
export const difference = (origObj: object, newObj: object) => {
  const changes = (newObj: any, origObj: any) => {
    let index = 0

    return transform(newObj, (result: any[], value, key) => {
      if (!isEqual(value, origObj[key])) {
        const resultKey = isArray(origObj) ? index++ : key
        result[resultKey] =
          isObject(value) && isObject(origObj[key])
            ? changes(value, origObj[key])
            : value
      }
    })
  }

  return changes(newObj, origObj)
}

/**
 * Shallow object comparison that returns the keys from the second object
 * that are different in the first.
 *
 * @param o1 Object
 * @param o2 Object
 */
export const shallowDiff = <T extends Record<string, any>>(
  o1: Record<string, any>,
  o2: T
): Partial<T> =>
  Object.keys(o2).reduce((diff, key) => {
    if (isEqual(o1[key], o2[key])) return diff

    return {
      ...diff,
      [key]: o2[key],
    }
  }, {})

/**
 * Parses an Axios error to avoid cyclic dependency
 * errors in Vuex.
 *
 * @param error Axios error.
 */
export const parseAxiosError = (error: AxiosError): StateError => {
  if (error.response) {
    let message: string

    if (
      error.response.status === 409 &&
      error.config.url?.includes('register')
    ) {
      message = 'An account with this email already exists.'
    } else {
      message = getErrorMessage(error.response.status)
    }

    return {
      url: error.config.url,
      status: error.response.status,
      message,
    }
  }

  return { message: error.message }
}

export const getErrorMessage = (status: number) => {
  switch (status) {
    case 413:
      return 'The upload is too large.'
    case 409:
      return 'The resource already exists in the database.'
    case 404:
      return 'The resource was not found.'
    case 400:
      return 'The request was not accepted by the server, ensure the necessary information was provided and try again, or contact an administrator.'
    default:
      return 'An unexpected error occured, please try again later.'
  }
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
 * Returns the absolute difference between two numbers.
 *
 * @param a Number.
 * @param b Number.
 */
export const diff = (a: number, b: number) => (a > b ? a - b : b - a)

/**
 * Converts an ISO time into the representational number of
 * milliseconds it represents.
 *
 * @param time ISO time string.
 */
export const getTimeValue = (time: string, format = 'HH:mm') => {
  const now = new Date()

  return diff(parse(time, format, now).getTime(), now.getTime())
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

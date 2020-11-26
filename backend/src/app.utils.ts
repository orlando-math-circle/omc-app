import {
  FindOneOptions,
  FindOneOrFailOptions,
  Populate as MikroORMPopulate,
} from '@mikro-orm/core';
import { differenceInYears, isAfter, isBefore, isSameDay } from 'date-fns';
import moment from 'moment';

/**
 * Types
 */

export type Dict = Record<string, unknown>;

export type Populate<T, P extends MikroORMPopulate<T> = any> =
  | P
  | FindOneOptions<T, P>;

export type PopulateFail<T, P extends MikroORMPopulate<T> = any> =
  | P
  | FindOneOrFailOptions<T, P>;

/**
 * Assertion Utilities
 */

export const isNumber = (fn: any): fn is number => typeof fn === 'number';

export const isString = (fn: any): fn is string => typeof fn === 'string';

/**
 * Determines if two single-dimension arrays of primities are equal.
 */
export const isEqualArray = <T extends string | number | boolean | null>(
  a: T[],
  b: T[],
) => a.length === b.length && a.every((i) => b.includes(i));

/**
 * Date Utilities
 */

export const toDate = (date: string | Date) =>
  typeof date === 'string' ? new Date() : date;

export const isBetween = (start: Date, end: Date, date: Date) =>
  isAfter(date, start) && isBefore(date, end);

export const isBetweenInclusive = (start: Date, end: Date, date: Date) =>
  (isSameDay(start, date) || isAfter(date, start)) &&
  (isSameDay(end, date) || isBefore(date, end));

export const birthdayToAge = (date: Date | string) =>
  differenceInYears(new Date(), toDate(date));

export const isBeforeDay = (dt1: Date, dt2: Date) =>
  moment(dt1).isBefore(dt2, 'day');

export const isAfterDay = (dt1: Date, dt2: Date) =>
  moment(dt1).isAfter(dt2, 'day');

export const addMinutes = (date: Date, minutes: number) =>
  moment(date).add(minutes, 'minutes').toDate();

export const getMinutesDiff = (dt1: Date, dt2: Date) =>
  moment(dt2).diff(dt1, 'minutes');

export const getMinDate = (...dates: Date[]) =>
  moment.min(dates.map((d) => moment(d))).toDate();

export const subDays = (date: Date, days = 1) =>
  moment(date).subtract(days, 'day').toDate();

export const getYearsDiff = (start: Date, end: Date) => {
  let retval = 0;
  const pivot = new Date(start.getTime());

  while (pivot < end) {
    pivot.setFullYear(pivot.getFullYear() + 1);
    retval++;
  }

  return retval;
};

export { isSameDay };

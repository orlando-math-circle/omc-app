import {
  FindOneOptions,
  FindOneOrFailOptions,
  Populate as MikroORMPopulate,
} from '@mikro-orm/core';
import {
  differenceInYears,
  isAfter,
  isBefore,
  isSameDay,
  addMinutes as _addMinutes,
  subDays as _subDays,
  differenceInMinutes,
  min,
} from 'date-fns';

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

export const isBoolean = (fn: any): fn is boolean => typeof fn === 'boolean';

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

export const isBeforeDay = (dt1: Date, dt2: Date) => isBefore(dt1, dt2);

export const isAfterDay = (dt1: Date, dt2: Date) => isAfter(dt1, dt2);

export const addMinutes = (date: Date, minutes: number) =>
  _addMinutes(date, minutes);

export const getMinutesDiff = (dt1: Date, dt2: Date) =>
  differenceInMinutes(dt1, dt2);

export const getMinDate = (...dates: Date[]) => min(dates);

export const subDays = (date: Date, days = 1) => _subDays(date, days);

export { isSameDay };

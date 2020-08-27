import { Collection } from '@mikro-orm/core';
import _ from 'lodash';
import moment from 'moment';

export type Dict = Record<string, unknown>;

export const isNumber = (fn: any): fn is number => typeof fn === 'number';

export const isString = (fn: any): fn is string => typeof fn === 'string';

/**
 * Moment Library Utilities
 */

export const isSameDay = (dt1: Date, dt2: Date) =>
  moment(dt1).isSame(dt2, 'day');

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

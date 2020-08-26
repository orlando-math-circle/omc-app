import { Collection } from '@mikro-orm/core';
import _ from 'lodash';
import moment from 'moment';

export type Dict = Record<string, unknown>;

export const isNumber = (fn: any): fn is number => typeof fn === 'number';

export const isString = (fn: any): fn is string => typeof fn === 'string';

export const isSameDay = (dt1: Date, dt2: Date) =>
  moment(dt1).isSame(dt2, 'day');

export const isBeforeDay = (dt1: Date, dt2: Date) =>
  moment(dt1).isBefore(dt2, 'day');

export const isAfterDay = (dt1: Date, dt2: Date) =>
  moment(dt1).isAfter(dt2, 'day');

export const addMinutes = (date: Date, minutes: number) =>
  moment(date).add(minutes, 'minutes').toDate();

/**
 * Returns an array contains the keys of object A which
 * are missing or not equal to those in object B.
 *
 * @param a parent object for key retrieval
 * @param b object for comparison
 */
export const diffObject = <A extends Dict, B extends Dict>(
  a: A,
  b: B,
): Partial<A> =>
  _.reduce(
    a,
    (result, value, key) =>
      _.isEqual(value, b[key])
        ? result
        : Object.assign(result, { [key]: value }),
    {},
  );

/**
 * Creates a generator for all of the elements in a MikroORM collection.
 *
 * @param collection Entity collection
 */
export function* getCollectionIterator<T>(collection: Collection<T>) {
  const items = collection.getItems();
  let i = 0;

  while (i < collection.length) {
    yield items[i++];
  }
}

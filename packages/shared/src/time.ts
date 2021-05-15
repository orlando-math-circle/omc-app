import { DateTime } from 'luxon';

export const toDate = (date: string | Date) => {
  return typeof date === 'string' ? new Date(date) : date;
};

export const toDateTime = (date: Date | string | number): DateTime => {
  switch (typeof date) {
    case 'number':
      return DateTime.fromMillis(date).toUTC();
    case 'string':
      return DateTime.fromISO(date).toUTC();
    case 'object':
      return DateTime.fromJSDate(date).toUTC();
  }
};

export const endOfDay = (date: Date | string | number) =>
  toDateTime(date).endOf('day').toJSDate();

export default {
  endOfDay,
};

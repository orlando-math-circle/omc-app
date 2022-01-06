export enum Frequency {
  YEARLY = 0,
  MONTHLY = 1,
  WEEKLY = 2,
  DAILY = 3,
}

export class RRuleDto {
  /**
   * The fidelity of the recurrence.
   */
  freq!: Frequency;

  /**
   * The interval between each frequency iteration.
   */
  interval!: number;

  /**
   * The starting Date or ISO8601 string representing the start date of the rrule.
   */
  dtstart!: Date | string;

  /**
   * Limits the rrule to end on a specific Date or ISO8601 string.
   *
   * Unique with `count`.
   */
  until?: Date | string;

  /**
   * Limits the rrule to a specific number of occurrences.
   *
   * Unique with `until`.
   */
  count?: number;

  /**
   * Limits the rrule to occur on specified days of the week
   * as an array of zero-indexed weekdays starting on Monday (0)
   * and ending on Sunday (6).
   */
  byweekday?: number[];

  /**
   * Limits the rrule by selecting a generated date by index.
   */
  bysetpos?: number;

  /**
   * Limits the rrule to a specific day of the month.
   */
  bymonthday?: number;
}

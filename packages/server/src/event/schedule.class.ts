import { isString, toDate } from '@omc/shared';
import RRule, { RRuleSet, rrulestr } from 'rrule';
import { RRuleDto } from '..';

export class Schedule {
  private _rrule: RRule | RRuleSet;

  constructor(options: string | RRuleDto, forceset = false) {
    if (isString(options)) {
      this._rrule = rrulestr(options, { forceset });
    } else {
      this._rrule = new RRule({
        ...options,
        dtstart: toDate(options.dtstart),
        until: options.until ? toDate(options.until) : undefined,
      });
    }
  }

  set rrule(rrule: RRule | RRuleSet) {
    this._rrule = rrule;
  }

  get dtstart() {
    return this.options.dtstart!;
  }

  get dtend() {
    if (this.options.until) {
      return this.options.until;
    } else if (this.options.count) {
      const events = this.all();

      return events[events.length - 1];
    }
  }

  get options() {
    if (this._rrule instanceof RRuleSet) {
      return this._rrule.rrules()[0].origOptions;
    }

    return this._rrule.origOptions;
  }

  /**
   * Returns all the occurrences of the rrule between after and before.
   * Inclusive keyword defines what happens if after and/or before are themselves occurrences.
   * With inclusive true, they will be included in the list, if they are found in the recurrence set.
   */
  public between(start: Date, end: Date, inclusive = true) {
    return this._rrule.between(start, end, inclusive);
  }

  /**
   * Returns the first date generated from the rrule.
   */
  public first() {
    return this._rrule.after(this.dtstart, true);
  }

  public all() {
    return this._rrule.all();
  }

  /**
   * Adds an EXDATE to the set.
   */
  public exdate(date: Date) {
    if (this._rrule instanceof RRuleSet) {
      return this._rrule.exdate(date);
    }

    this.convert();

    return (this._rrule as RRuleSet).exdate(date);
  }

  /**
   * Returns the number of recurrences in this set.
   * It will have go trough the whole recurrence, if this hasn't been done before.
   */
  public count() {
    return this._rrule.count();
  }

  /**
   * Converts the RRule into its string representation.
   */
  public toString() {
    return this._rrule.toString();
  }

  /**
   * Converts an RRule into a RRuleSet
   */
  private convert() {
    if (this._rrule instanceof RRuleSet) return;

    const set = new RRuleSet();
    set.rrule(this._rrule);
    this._rrule = set;
  }
}

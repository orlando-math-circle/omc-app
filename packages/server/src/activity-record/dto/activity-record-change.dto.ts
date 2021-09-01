import { ActivityRecordChangeKey } from '../enums/activity-record-change-key.enum';

export class ActivityRecordChangeDto {
  /**
   * New value of the key. If missing, the key was reset or deleted.
   */
  readonly newValue?: any;

  /**
   * The value of the key before the change.
   */
  readonly oldValue?: any;

  /**
   * The property or state that was changed.
   */
  readonly key!: ActivityRecordChangeKey;
}

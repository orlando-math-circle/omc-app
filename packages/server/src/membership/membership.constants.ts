import { Grade } from '../user/enums/grade.enum';

export const MIDDLE_SCHOOL_MEMBERSHIP_FEE = '25.00';
export const HIGH_SCHOOL_MEMBERSHIP_FEE = '50.00';

export const MIDDLE_SCHOOL_GRADES = Object.freeze([
  Grade.SIXTH,
  Grade.SEVENTH,
  Grade.EIGHTH,
]);

export const HIGH_SCHOOL_GRADES = Object.freeze([
  Grade.NINTH,
  Grade.TENTH,
  Grade.ELEVENTH,
  Grade.TWELFTH,
]);

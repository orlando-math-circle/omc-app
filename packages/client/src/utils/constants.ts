import { Roles } from '@server/app.roles'
import { Gender } from '@server/user/enums/gender.enum'
import { Grade } from '@server/user/enums/grade.enum'
import { ReminderFreq } from '@server/user/enums/reminder-freq.enum'
import { VolunteerWorkStatus } from '@server/volunteer-work/enums/work-status.enum'

export const TIMEZONE = 'America/New_York'

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const monthSelections = Object.freeze(
  months.map((m, i) => ({ text: m, value: i }))
)

export const workStatuses = Object.freeze([
  { text: 'Approved', value: VolunteerWorkStatus.APPROVED },
  { text: 'Pending', value: VolunteerWorkStatus.PENDING },
  { text: 'Denied', value: VolunteerWorkStatus.DENIED },
])

export const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export type Item<T, K> = { value: T; text: K }

export type CalendarType = 'simple' | 'month' | 'week' | 'day' | '4day'

export const calendarTypes: Readonly<Item<CalendarType, string>[]> =
  Object.freeze([
    { value: 'simple', text: 'Simple' },
    { value: 'month', text: 'Month' },
    { value: 'week', text: 'Week' },
    { value: 'day', text: 'Day' },
    { value: '4day', text: '4-Day' },
  ])

export const genders = Object.freeze([
  { text: 'Male', value: Gender.MALE },
  { text: 'Female', value: Gender.FEMALE },
])

export const roles = Object.freeze([
  { text: 'User', value: Roles.DEFAULT },
  { text: 'Administrator', value: Roles.ADMIN },
  { text: 'Volunteer', value: Roles.VOLUNTEER },
])

export const education = Object.freeze({
  'Elementary School': [
    { text: 'Kindergarten', value: Grade.KINDERGARTEN },
    { text: '1st Grade', value: Grade.FIRST },
    { text: '2nd Grade', value: Grade.SECOND },
    { text: '3rd Grade', value: Grade.THIRD },
    { text: '4th Grade', value: Grade.FOURTH },
    { text: '5th Grade', value: Grade.FIFTH },
  ],
  'Middle School': [
    { text: '6th Grade', value: Grade.SIXTH },
    { text: '7th Grade', value: Grade.SEVENTH },
    { text: '8th Grade', value: Grade.EIGHTH },
  ],
  'High School': [
    { text: '9th Grade', value: Grade.NINTH },
    { text: '10th Grade', value: Grade.TENTH },
    { text: '11th Grade', value: Grade.ELEVENTH },
    { text: '12th Grade', value: Grade.TWELFTH },
  ],
  College: [
    { text: 'Undergraduate', value: Grade.UNDERGRADUATE },
    { text: 'Postgraduate', value: Grade.POSTGRADUATE },
  ],
})

export const EducationItems = Object.freeze(Object.values(education).flat())

export const reminders = Object.freeze([
  { text: 'Week Before', value: ReminderFreq.WEEK },
  { text: 'Day Before', value: ReminderFreq.DAY },
  { text: 'Hour Before', value: ReminderFreq.HOUR },
  { text: '15 Minutes Before', value: ReminderFreq.FIFTEEN },
])

/**
 * Authentication
 */

export const COOKIE_THEME = 'omc-theme'
export const COOKIE_JWT = 'omc-token'
export const COOKIE_COMPLETE = 'omc-complete'
export const COOKIE_NAME = 'omc_token'
export const COOKIE_CALENDAR_TYPE = 'omc_calendar_type'

export { Gender, Grade, Roles, ReminderFreq }

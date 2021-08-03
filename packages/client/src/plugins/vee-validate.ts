import { differenceInYears, isAfter, parse } from 'date-fns'
import { isNumber } from 'lodash'
import { extend, setInteractionMode } from 'vee-validate'
import { email, min_value, max_value } from 'vee-validate/dist/rules'

/**
 * Plugin: VeeValidate
 *
 * This file contains the installed rules that components with
 * `Validated` in their name can use in the `rules` field.
 */

/**
 * Reduces the aggressiveness of vee-validate to not throw errors while the user
 * is still filling out the field being validated.
 *
 * @see https://vee-validate.logaretm.com/v3/guide/interaction-and-ux.html#interaction-modes
 */
setInteractionMode('eager')

extend('min_value', min_value)
extend('max_value', max_value)

extend('positive', {
  validate: (value) => isNumber(value) && value > 0,
  message: 'Value must be positive.',
})

extend('has_course', {
  params: ['course'],
  validate: (value, { course }: any) => {
    return value === 'course' ? !!course : true
  },
  message: 'Selecting a course is required for this payment mode',
})

extend('email', email)

extend('ext', {
  validate: (
    files: File | File[],
    extensions: string[] | Record<string, any>
  ) => {
    const regex = new RegExp(`.(${extensions.join('|')})$`, 'i')

    if (Array.isArray(files)) {
      return files.every((file) => regex.test(file.name))
    }

    return regex.test(files.name)
  },
  message: 'This file type is not permitted.',
})

/**
 * A date of birth is invalid if it occurs in the future.
 *
 * This is split from the other rules to allow for message overrides.
 */
extend('positive_age', {
  validate: (value) => isAfter(new Date(), new Date(value)),
  message: 'Please enter a valid date of birth.',
})

extend('min_age', {
  params: ['min'],
  validate: (value, { min }: any) =>
    differenceInYears(new Date(), new Date(value)) > min,
  message: 'Please have a parent or guardian register for you.',
})

extend('max_age', {
  params: ['max'],
  validate: (value, { max }: any) =>
    differenceInYears(new Date(), new Date(value)) < max,
  message: 'Please enter a valid date of birth.',
})

extend('required', {
  validate(value) {
    return {
      required: true,
      valid: !['', null, undefined].includes(value),
    }
  },
  computesRequired: true,
  message: 'This field is required.',
})

extend('password', {
  params: ['target'],
  validate: (value, { target }: any) => value === target,
  message: 'Password confirmation does not match.',
})

extend('startdate', {
  params: ['target'],
  validate: (value, { target }: any) => {
    return (
      parse(value, 'EEE, LLL d, yyyy', new Date()) <=
      parse(target, 'EEE, LLL d, yyyy', new Date())
    )
  },
  message: 'Start date cannot be after the end date.',
})

extend('starttime', {
  params: ['time'],
  validate: (value, { time }: any) => {
    const now = new Date()
    return parse(value, 'h:mm aaa', now) <= parse(time, 'h:mm aaa', now)
  },
  message: 'Start time cannot be after end time',
})

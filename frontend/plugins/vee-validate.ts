import { extend, setInteractionMode } from 'vee-validate'
import { email } from 'vee-validate/dist/rules'
import { parse } from 'date-fns'
import { getTimeValue } from '../utils/utilities'

/**
 * Reduces the aggressiveness of vee-validate to not throw errors while the user
 * is still filling out the field being validated.
 *
 * @see https://logaretm.github.io/vee-validate/guide/interaction-and-ux.html#interaction-modes
 */
setInteractionMode('lazy')

extend('email', email)

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
      parse(value, 'EEEE, LLLL do', new Date()) <=
      parse(target, 'EEEE, LLLL do', new Date())
    )
  },
  message: 'Start date cannot be after the end date.',
})

extend('starttime', {
  params: ['time'],
  validate: (value, { time }: any) => getTimeValue(value) <= getTimeValue(time),
  message: 'Start time cannot be after end time',
})

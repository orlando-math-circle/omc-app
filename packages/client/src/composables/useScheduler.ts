import { ref, computed, set, del, unref, Ref } from '@nuxtjs/composition-api'
import { FeeType } from '@server/event/enums/fee-type.enum'
import { EntityDTO } from '@server/shared/types/entity-dto'
import {
  EventRecurrenceDto,
  UpdateEventDto,
  UpdateEventsDto,
} from '@omc/server'
import { EventTimeThreshold } from '@server/event/enums/event-time-threshold.enum'
import { defaults, isEqual } from 'lodash'
import { add } from 'date-fns'
import { isNumber } from '@omc/shared'
import { Event } from '@/stores'
import { useDates, useRRule } from '@/composables'
import { roundDate } from '@/utils/utilities'
import { Gender, Grade } from '@/utils/constants'
import { MaybeRef } from '@/types'

const EVENT_DEFAULTS = Object.freeze({
  FEE: {
    type: FeeType.FREE,
    amount: '0.00',
    lateAmount: '0.00',
  },
  META: {
    name: '',
    description: '',
    location: '',
    color: '',
    locationTitle: '',
    picture: '',
    cutoffThreshold: EventTimeThreshold.AFTER_END,
    cutoffOffset: 0,
    lateThreshold: EventTimeThreshold.AFTER_START,
    lateOffset: 0,
    project: null as number | null,
    course: null as number | null,
    permissions: {
      grades: [
        Grade.KINDERGARTEN,
        Grade.FIRST,
        Grade.SECOND,
        Grade.THIRD,
        Grade.FOURTH,
        Grade.FIFTH,
        Grade.SIXTH,
        Grade.SEVENTH,
        Grade.EIGHTH,
        Grade.NINTH,
        Grade.TENTH,
        Grade.ELEVENTH,
        Grade.TWELFTH,
      ],
      genders: [Gender.MALE, Gender.FEMALE],
    },
  },
})
/**
 * Event creation, modification, and parsing.
 *
 * @param {Event} [event] - Existing event, if available.
 */
export function useEventManager(event?: Event) {
  const _event = ref<Event | null>(event || null)
  const _dtstart = ref<string | null>(null)
  const _rrule = ref<EntityDTO<EventRecurrenceDto> | null>(null)
  const dto = ref<EntityDTO<UpdateEventDto> | EntityDTO<UpdateEventsDto>>({})

  const dates = useDates()
  const rruleUtils = useRRule()

  function toCostStringPrecision(amount: string, precision = 2) {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: precision,
    })
  }

  function getEventFee(event: MaybeRef<Event>) {
    return unref(event).course?.fee || unref(event).fee
  }

  function getEventFeeType(event: MaybeRef<Event>) {
    return unref(event).course
      ? FeeType.COURSE
      : unref(event).fee
      ? FeeType.EVENT
      : FeeType.FREE
  }

  const dtstart = computed({
    get: () => {
      if (!_dtstart.value) {
        return roundDate(new Date(), 30).toISOString()
      }

      return _dtstart.value
    },
    set: (value) => (_dtstart.value = value),
  })

  const dtend = computed({
    get: () => {
      if (dto.value.dtend) {
        return dto.value.dtend
      } else if (_event.value?.dtend) {
        return _event.value.dtend
      }

      return add(new Date(dtstart.value), {
        hours: 1,
        minutes: 30,
      }).toISOString()
    },
    set: (value) => {
      if (_event.value?.dtend === value) {
        return del(dto.value, 'dtend')
      }

      dto.value.dtend = value
    },
  })

  const startDate = computed({
    get: () => dates.format(new Date(dtstart.value), 'yyyy-MM-dd'),
    set: (value) => {
      const currentDate = new Date(dtstart.value)
      const [year, month, day] = value.split('-').map((v) => parseInt(v))

      currentDate.setFullYear(year, month - 1, day)

      dtstart.value = currentDate.toISOString()
    },
  })

  const endDate = computed({
    get: () => dates.format(new Date(dtend.value), 'yyyy-MM-dd'),
    set: (value) => {
      const currentDate = new Date(dtend.value)
      const [year, month, day] = value.split('-').map((v) => parseInt(v))

      currentDate.setFullYear(year, month - 1, day)

      dtend.value = currentDate.toISOString()
    },
  })

  const startTime = computed({
    get: () => dates.format(dtstart.value, 'HH:mm'),
    set: (value) => {
      const currentDate = new Date(dtstart.value)
      const [hours, minutes] = value.split(':').map((v) => parseInt(v))

      currentDate.setHours(hours, minutes)

      dtstart.value = currentDate.toISOString()
    },
  })

  const endTime = computed({
    get: () => dates.format(dtend.value, 'HH:mm'),
    set: (value) => {
      const currentDate = new Date(dtend.value)
      const [hours, minutes] = value.split(':').map((v) => parseInt(v))

      currentDate.setHours(hours, minutes)

      dtend.value = currentDate.toISOString()
    },
  })

  const rrule = computed({
    get: () => _rrule.value,
    set: (value) => {
      const originalRRule = _event.value?.recurrence
        ? (rruleUtils.getDeserialized(
            _event.value.recurrence.rrule
          ) as EntityDTO<EventRecurrenceDto>)
        : null

      // Remove the rrule from the DTO if it's the same as the original.
      if ((originalRRule && isEqual(originalRRule, value)) || value === null) {
        return del(dto.value, 'rrule')
      }

      dto.value.rrule = value
    },
  })

  const fee = computed({
    get: () => {
      // Fee data in the dto payload indicates a new or modified fee.
      if ('fee' in dto.value) {
        return defaults(
          {
            type: dto.value.feeType,
            amount: dto.value.fee?.amount,
            lateAmount: dto.value.fee?.lateAmount,
          },
          EVENT_DEFAULTS.FEE
        )
      }

      // Use the event's fee data.
      if (_event.value) {
        const fee = getEventFee(_event.value)

        return defaults(
          {
            type: getEventFeeType(_event.value),
            amount: fee?.amount,
            lateAmount: fee?.lateAmount,
          },
          EVENT_DEFAULTS.FEE
        )
      }

      // Otherwise, send the default values
      return defaults({}, EVENT_DEFAULTS.FEE)
    },
    set: (value) => {
      // Ensure two-decimal monetary precision.
      value = {
        type: value.type,
        amount: toCostStringPrecision(value.amount, 2),
        lateAmount: toCostStringPrecision(value.lateAmount, 2),
      }

      const fee = _event.value && getEventFee(_event.value)
      const type = _event.value && getEventFeeType(_event.value)

      const eventFee = {
        type: type || FeeType.FREE,
        amount: fee?.amount || '0.00',
        lateAmount: fee?.lateAmount || '0.00',
      }

      // If the current interpretation of the event fee is
      // the same as this new value, we don't need to update
      // and should clear anything currently in the dto.
      if (isEqual(value, eventFee)) {
        del(dto.value, 'fee')
      }

      // Otherwise, we need to update the fee using the DTO.
      else {
        set(dto.value, 'fee', value)
      }
    },
  })

  const meta = computed({
    get: () => {
      let target: Ref<Event | UpdateEventDto | UpdateEventsDto> | null = null

      if ('meta' in dto.value) {
        target = dto
      }

      if (_event.value !== null) {
        target = _event as Ref<Event>
      }

      if (target?.value) {
        return {
          name: target.value.name,
          description: target.value.description,
          location: target.value.location,
          locationTitle: target.value.locationTitle,
          picture: target.value.picture,
          color: target.value.color,
          cutoffThreshold: target.value.cutoffThreshold,
          cuttoffOffset: target.value.cutoffOffset,
          lateThreshold: target.value.lateThreshold,
          lateOffset: target.value.lateOffset,
          project: isNumber(target.value.project)
            ? target.value.project
            : target.value.project?.id,
          course: isNumber(target.value.course)
            ? target.value.course
            : target.value.course?.id,
          permissions: target.value.permissions,
        }
      }

      return defaults({}, EVENT_DEFAULTS.META)
    },
    set: (value) => {
      if (_event.value) {
        const eventMeta = {
          name: _event.value.name,
          description: _event.value.description,
          location: _event.value.location,
          locationTitle: _event.value.locationTitle,
          picture: _event.value.picture,
          color: _event.value.color,
          cutoffThreshold: _event.value.cutoffThreshold,
          cuttoffOffset: _event.value.cutoffOffset,
          lateThreshold: _event.value.lateThreshold,
          lateOffset: _event.value.lateOffset,
          project: _event.value.project?.id,
          course: _event.value.course?.id,
          permissions: _event.value.permissions,
        }

        if (isEqual(value, eventMeta)) {
          del(dto.value, 'meta')
        } else {
          set(dto.value, 'meta', value)
        }

        return
      }

      set(dto.value, 'meta', value)
    },
  })

  return {
    dtstart,
    dtend,
    start: {
      date: startDate,
      time: startTime,
    },
    end: {
      date: endDate,
      time: endTime,
    },
    rrule,
    fee,
    meta,
    startTime,
  }
}

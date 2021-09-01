<template>
  <div>
    <strong v-if="actor">
      <NuxtLink v-if="actor.link" :to="actor.link">{{ actor.text }}</NuxtLink>

      <span v-else>{{ actor.text }}</span>
    </strong>

    <span>{{ action }}</span>

    <strong v-if="target">
      <NuxtLink v-if="target.link" :to="target.link">{{
        target.text
      }}</NuxtLink>

      <span v-else>{{ target.text }}</span>
    </strong>

    <span v-if="changePreposition">{{ changePreposition }}</span>

    <strong v-if="change">
      <NuxtLink v-if="change.link" :to="change.link">{{
        change.text
      }}</NuxtLink>

      <span v-else>{{ change.text }}</span>
    </strong>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { RecordEntity, useActivityRecords } from '@/stores'
import { ActivityRecordEvent } from '../../../server/src/activity-record/enums/activity-record-event.enum'

interface Entity {
  text: string
  link?: string | null
}

export default defineComponent({
  props: {
    record: {
      type: Object as PropType<RecordEntity>,
      required: true,
    },
  },
  setup(props) {
    const recordStore = useActivityRecords()

    const actor = computed<Entity>(() => {
      if (!props.record.userId) {
        return {
          text: 'System',
        }
      }

      const user = recordStore.users.find(
        (u) => u.id.toString() === props.record.userId
      )

      return {
        text: user?.name || 'Deleted User',
        link: user ? `/admin/users/${user?.id}` : null,
      }
    })

    const action = computed(() => {
      switch (props.record.type) {
        case ActivityRecordEvent.EVENT_CREATE:
          return ' created '
        case ActivityRecordEvent.EVENT_UPDATE:
          return ' updated '
        case ActivityRecordEvent.EVENT_DELETE:
          return ' deleted '
        case ActivityRecordEvent.VOLUNTEER_SWAP_REQUEST:
          return ' requested volunteer coverage for '
        case ActivityRecordEvent.VOLUNTEER_SWAP_COMPLETE:
          return ' covered '
        case ActivityRecordEvent.VOLUNTEER_SWAP_CANCEL:
          return ' cancelled their volunteer registration for '
        case ActivityRecordEvent.EMAIL_ACCOUNT_CREATE:
          return ' sent '
      }
    })

    const target = computed<Entity | null>(() => {
      if (!props.record.targetId) {
        return null
      }

      switch (props.record.type) {
        case ActivityRecordEvent.EVENT_UPDATE:
        case ActivityRecordEvent.EVENT_CREATE: {
          const event = recordStore.events.find(
            (e) => e.id.toString() === props.record.targetId
          )

          return {
            text: event?.name || 'Deleted Event',
          }
        }
        case ActivityRecordEvent.VOLUNTEER_SWAP_COMPLETE:
        case ActivityRecordEvent.VOLUNTEER_SWAP_REQUEST: {
          const registration = recordStore.registrations.find(
            (r) => r.id.toString() === props.record.targetId
          )

          return {
            text: registration?.event?.name || 'Deleted Event',
            link: registration?.event?.id
              ? `/admin/calendar/events/${registration?.event?.id}`
              : null,
          }
        }
        default:
          return null
      }
    })

    const change = computed<Entity | null>(() => {
      if (!props.record.changes) {
        return null
      }

      switch (props.record.type) {
        case ActivityRecordEvent.VOLUNTEER_SWAP_COMPLETE: {
          const oldUser = recordStore.users.find(
            (u) => u.id === props.record.changes?.[0].oldValue
          )

          return {
            text: oldUser?.name || 'Deleted User',
            link: oldUser ? `/admin/users/${oldUser?.id}` : null,
          }
        }
        default:
          return null
      }
    })

    const changePreposition = computed(() => {
      if (!props.record.changes) {
        return null
      }

      switch (props.record.type) {
        case ActivityRecordEvent.VOLUNTEER_SWAP_COMPLETE: {
          return ' for '
        }
      }
    })

    return {
      actor,
      action,
      target,
      change,
      changePreposition,
    }
  },
})
</script>

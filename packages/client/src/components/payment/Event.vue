<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { useSnackbar, usePayPalButtons } from '~/composables'
import { useEvents } from '~/stores'

export default defineComponent({
  props: {
    eventId: {
      type: Number,
      required: true,
    },
    userIds: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const buttons = ref<HTMLDivElement>()
    const eventStore = useEvents()
    const snackbar = useSnackbar()

    usePayPalButtons({
      buttonEl: buttons,
      createOrder: async () => {
        const order = await eventStore.createOrder(props.eventId, props.userIds)

        return order.id
      },
      onApprove: async (data, actions) => {
        const invoices = await eventStore.captureOrder(
          props.eventId,
          data.orderID
        )

        if (eventStore.error) {
          const details = eventStore.error.data?.details

          // Insufficient funds errors can be retried by the user.
          if (
            Array.isArray(details) &&
            details[0]?.issue === 'INSTRUMENT_DECLINED'
          ) {
            return actions.restart()
          }
          return snackbar.error(eventStore.error.message)
        }

        emit('payment:complete', invoices)
      },
    })

    return { buttons }
  },
})
</script>

<template>
  <div ref="buttons" />
</template>

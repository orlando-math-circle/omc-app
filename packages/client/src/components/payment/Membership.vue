<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { useSnackbar, usePayPalButtons } from '~/composables'
import { useMembership } from '~/stores'

export default defineComponent({
  props: {
    userIds: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const buttons = ref<HTMLDivElement>()
    const membershipStore = useMembership()
    const snackbar = useSnackbar()

    usePayPalButtons({
      buttonEl: buttons,
      createOrder: async () => {
        const order = await membershipStore.createOrder({
          userIds: props.userIds,
        })

        return order.id
      },
      onApprove: async (data, actions) => {
        const invoices = await membershipStore.captureOrder(data.orderID)

        if (membershipStore.error) {
          const details = membershipStore.error.data?.details

          // Insufficient funds errors can be retried by the user.
          if (
            Array.isArray(details) &&
            details[0]?.issue === 'INSTRUMENT_DECLINED'
          ) {
            return actions.restart()
          }

          return snackbar.error(membershipStore.error.message)
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

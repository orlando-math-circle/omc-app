<template>
  <div ref="buttons" />
</template>

<script lang="ts">
import { useSnackbar } from '@/composables'
import { useMemberPayPal } from '@/stores'
import {
  defineComponent,
  PropType,
  reactive,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { useScriptTag } from '@vueuse/core'

declare const paypal: any

export default defineComponent({
  props: {
    users: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const buttons = ref<HTMLDivElement>()

    const state = reactive({
      loaded: false,
      completed: false,
    })

    const { $config } = useContext()
    const paypalStore = useMemberPayPal()
    const snackbar = useSnackbar()

    const onScriptLoad = () => {
      state.loaded = true
      paypal
        .Buttons({
          style: {
            size: 'responsive',
          },
          createOrder: async () => {
            const order = await paypalStore.createOrder(props.users)

            return order.id
          },
          onApprove: async (data: any, actions: { restart: () => void }) => {
            const invoices = await paypalStore.captureOrder(data.orderID)

            if (paypalStore.error) {
              snackbar.error(paypalStore.error.message)

              actions.restart()
              return
            }

            state.completed = true
            emit('payment:complete', invoices)
          },
        })
        .render(buttons.value)
    }

    useScriptTag(
      `https://www.paypal.com/sdk/js?client-id=${$config.paypalClientId}`,
      onScriptLoad
    )

    return {
      buttons,
    }
  },
})
</script>

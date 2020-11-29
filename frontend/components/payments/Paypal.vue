<template>
  <div ref="buttons"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

declare const paypal: any

@Component
export default class PayPal extends Vue {
  @Prop() readonly event!: number
  @Prop() readonly users!: number[]

  loaded = false
  completed = false

  onLoad() {
    this.loaded = true
    paypal
      .Buttons({
        style: {
          size: 'responsive',
        },
        createOrder: async () => {
          const order = await this.$accessor.paypal.create({
            eventId: this.event,
            users: this.users,
          })

          return order.id
        },
        onApprove: async (data: any, actions: { restart: () => void }) => {
          const invoices = await this.$accessor.paypal.capture({
            eventId: this.event,
            orderId: data.orderID,
          })

          if (this.$accessor.paypal.isErrored) {
            console.log(this.$accessor.paypal.error)

            actions.restart()
            return
          }

          this.completed = true
          this.$emit('payment:complete', invoices)
        },
      })
      .render(this.$refs.buttons)
  }

  mounted() {
    const script = document.createElement('script')
    script.setAttribute(
      'src',
      `https://www.paypal.com/sdk/js?client-id=${this.$config.paypalClientId}`
    )
    script.addEventListener('load', () => this.onLoad())
    document.head.appendChild(script)
  }
}
</script>

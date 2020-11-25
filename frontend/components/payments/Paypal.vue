<template>
  <div>
    <div v-if="loading">
      <v-progress-circular indeterminate />
    </div>
    <div v-if="!completed" ref="buttons"></div>

    <v-alert v-else type="success"> Payment successfully completed. </v-alert>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

declare const paypal: any

@Component
export default class PayPal extends Vue {
  @Prop() readonly event!: number
  @Prop() readonly users!: number[]

  loaded = false
  loading = false
  completed = false

  onLoad() {
    this.loaded = true
    paypal
      .Buttons({
        createOrder: async () => {
          const order = await this.$accessor.paypal.create({
            eventId: this.event,
            users: this.users,
          })

          return order.id
        },
        onApprove: async (data: any) => {
          this.loading = true
          const invoices = await this.$accessor.paypal.capture({
            eventId: this.event,
            orderId: data.orderID,
          })

          this.loading = false
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

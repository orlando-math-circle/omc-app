<template>
  <div ref="buttons"></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

declare const paypal: any

@Component
export default class PayPal extends Vue {
  loaded = false

  onLoad() {
    this.loaded = true
    paypal
      .Buttons({
        createOrder: () =>
          this.$store.dispatch('paypal/createOrder').then((data) => data.id),
        onApprove: (data: any) =>
          this.$store.dispatch('paypal/captureOrder', {
            id: data.orderID,
          }),
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

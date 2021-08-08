import { useContext, unref } from '@nuxtjs/composition-api'
import { MaybeRef, useScriptTag } from '@vueuse/core'

export interface PayPalButtonOptions {
  /**
   * Div to render the PayPal buttons in.
   */
  buttonEl: MaybeRef<HTMLDivElement | undefined>

  /**
   * Function that creates and returns the PayPal order Id.
   */
  createOrder: () => Promise<Number>

  /**
   * Function that captures the PayPal order when the user
   * approves the payment.
   */
  onApprove: (data: any, actions: { restart: () => void }) => Promise<void>
}

declare const paypal: any

export const usePayPalButtons = (options: PayPalButtonOptions) => {
  const { $config } = useContext()

  // A development client id of `SB` (Sandbox) will lead to console warnings.
  const url = `https://www.paypal.com/sdk/js?client-id=${$config.paypalClientId}`

  useScriptTag(url, () => {
    paypal
      .Buttons({
        style: {
          size: 'responsive',
        },
        createOrder: options.createOrder,
        onApprove: options.onApprove,
      })
      .render(unref(options.buttonEl))
  })
}

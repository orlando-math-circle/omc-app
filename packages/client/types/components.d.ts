declare module 'vue' {
  export interface GlobalComponents {
    Snackbar: typeof import('../src/components/Snackbar.vue')['default']
    PaymentEvent: typeof import('../src/components/payment/Event.vue')['default']
    PaymentMembership: typeof import('../src/components/payment/Membership.vue')['default']
  }
}

export {}

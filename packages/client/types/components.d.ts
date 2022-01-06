declare module 'vue' {
  export interface GlobalComponents {
    Snackbar: typeof import('../src/components/Snackbar.vue')['default']
    PaymentEvent: typeof import('../src/components/payment/Event.vue')['default']
    PaymentMembership: typeof import('../src/components/payment/Membership.vue')['default']
    DialogCreateCourse: typeof import('../src/components/dialog/CreateCourse.vue')['default']
    DialogSelectProject: typeof import('../src/components/dialog/SelectProject.vue')['default']
    DialogSelectCourse: typeof import('../src/components/dialog/SelectCourse.vue')['default']
  }
}

export {}

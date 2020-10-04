import { actionTree } from 'nuxt-typed-vuex'
import { Invoice } from '../../backend/src/invoice/invoice.entity'

export const state = () => ({})

export const actions = actionTree(
  { state },
  {
    create(
      _actionTree,
      { eventId, users }: { eventId: number; users: number[] }
    ) {
      return this.$axios.$post(`/registration/order/create/${eventId}`, {
        users,
      })
    },
    capture(
      _actionTree,
      { eventId, orderId }: { eventId: number; orderId: number }
    ) {
      return this.$axios.$post<Invoice[]>(
        `/registration/order/capture/${eventId}/${orderId}`
      )
    },
  }
)

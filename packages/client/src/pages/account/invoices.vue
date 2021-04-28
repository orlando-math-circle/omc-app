<template>
  <v-card :loading="$fetchState.pending">
    <v-card-title>Payment History</v-card-title>
    <v-card-subtitle>
      View a list of the transactions made on your account.
    </v-card-subtitle>

    <v-card-text v-if="invoices.length === 0">
      <v-alert type="info">No invoices found</v-alert>
    </v-card-text>

    <v-list v-else two-line>
      <template v-for="(invoice, i) in invoices">
        <v-list-item :key="invoice.id">
          <v-list-item-avatar>
            <v-icon>mdi-currency-usd</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              {{ invoice.course ? invoice.course.name : 'Event Fees' }} -
              {{ invoice.gross }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ format(invoice.purchasedAt, 'EEEE, MMMM do, yyyy') }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action v-if="invoice.event">
            <v-tooltip>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  :to="'/events/' + invoice.event"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </template>

              <span>View Event</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>

        <v-divider
          v-if="i < invoices.length"
          :key="invoice.id + '-divider'"
        ></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import { formatDate } from '~/utils/utilities'

export default defineComponent({
  transition(_to, from) {
    if (!from) return 'slide-left'

    return from.name === 'account-settings' ? 'slide-right' : 'slide-left'
  },
  setup() {
    const { $accessor: store } = useContext()
    const invoices = computed(() => store.invoices.invoices)

    useFetch(async () => {
      await store.invoices.findByAccount()
    })

    return { invoices, format: formatDate }
  },
  head: {
    title: 'Account Invoices',
  },
})
</script>

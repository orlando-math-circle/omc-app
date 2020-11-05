<template>
  <v-card>
    <v-card-title>Payment History</v-card-title>
    <v-card-subtitle>Recent transactions</v-card-subtitle>

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
import { Component, Vue } from 'nuxt-property-decorator'
import { formatDate } from '../../utils/utilities'

@Component({
  head: {
    title: 'Account Invoices',
  },
  transition(_to, from) {
    if (!from) return 'slide-left'

    return from.name === 'account-settings' ? 'slide-right' : 'slide-left'
  },
})
export default class AccountInvoicesPage extends Vue {
  get invoices() {
    return this.$accessor.invoices.invoices
  }

  format(date: Date | string, formatter: string) {
    return formatDate(date, formatter)
  }

  async fetch() {
    await this.$accessor.invoices.findByEvent
  }
}
</script>

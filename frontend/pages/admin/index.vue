<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12" md="4">
        <chart-card
          title="New Users"
          subtitle="Users added this month"
          icon="mdi-account-plus-outline"
          :options="userChartOptions"
          :series="userChartSeries"
        >
        </chart-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card></v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card></v-card>
      </v-col>
    </v-row>

    <v-row></v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  layout: 'admin',
})
export default class AdminIndex extends Vue {
  statistics = {
    users: null as null | any,
  }

  get userChartSeries() {
    if (!this.statistics.users)
      return [
        {
          name: 'Missing',
          type: 'area',
          data: [],
        },
      ]

    return [
      {
        name: 'New Users',
        data: Object.values(this.statistics.users.month),
      },
    ]
  }

  get userChartOptions() {
    return {
      chart: {
        height: 60,
        type: 'area',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      fill: {
        opacity: 1,
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      colors: ['#8c9eff'],
      labels: this.statistics.users?.labels,
    }
  }

  async fetch() {
    this.statistics.users = await this.$axios.$get('/user/statistics')
  }
}
</script>

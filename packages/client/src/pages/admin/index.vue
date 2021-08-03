<template>
  <v-row>
    <v-col cols="12" md="4">
      <ChartCard
        title="Users"
        subtitle="Users added this month"
        icon="mdi-account-plus-outline"
        :options="userChartOptions"
        :series="userChartSeries"
      />
    </v-col>

    <v-col cols="12" md="4">
      <v-card />
    </v-col>

    <v-col cols="12" md="4">
      <v-card />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent, useFetch } from '@nuxtjs/composition-api'
import { useUsers } from '@/stores'

export default defineComponent({
  layout: 'admin',
  setup() {
    const userStore = useUsers()

    const userStatistics = computed(() => userStore.statistics)

    const userChartSeries = computed(() => {
      if (!userStatistics.value.length) {
        return [
          {
            name: 'Missing',
            type: 'area',
            data: [],
          },
        ]
      }

      return [
        {
          name: 'New Users',
          data: userStatistics.value.map((stat) => stat.count),
        },
      ]
    })

    const userChartOptions = computed(() => ({
      chart: {
        height: 60,
        type: 'area',
        sparkline: {
          enabled: true,
        },
        tooltip: {},
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
      labels: userStatistics.value.map((stat) => stat.label),
    }))

    useFetch(async () => {
      await userStore.getStatistics()
    })

    return {
      userChartSeries,
      userChartOptions,
    }
  },
})
</script>

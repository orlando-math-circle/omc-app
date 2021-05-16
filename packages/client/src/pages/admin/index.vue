<template>
  <v-row>
    <v-col cols="12" md="4">
      <ChartCard
        title="New Users"
        subtitle="Users added this month"
        icon="mdi-account-plus-outline"
        :options="userChartOptions"
        :series="userChartSeries"
      />
    </v-col>

    <v-col cols="12" md="4">
      <v-card></v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card></v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'admin',
  setup() {
    const { $axios } = useContext()
    const state = ref({
      statistics: {
        users: null as any,
      },
    })

    const userChartSeries = computed(() => {
      if (!state.value.statistics.users) {
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
          data: Object.values(state.value.statistics.users.month),
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
      labels: state.value.statistics.users?.labels,
    }))

    useFetch(async () => {
      state.value.statistics.users = await $axios.$get('/user/statistics')
    })

    return {
      userChartSeries,
      userChartOptions,
    }
  },
})
</script>

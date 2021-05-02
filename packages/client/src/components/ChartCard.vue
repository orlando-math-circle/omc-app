<template>
  <v-card>
    <v-card-title v-text="title"></v-card-title>

    <div class="d-flex flex-column flex-grow-1">
      <div class="px-2 pb-2">
        <div class="d-flex align-center">
          <h4 v-text="current"></h4>
          <v-spacer />

          <div class="d-flex flex-column text-right" v-text="subtitle"></div>
        </div>
      </div>

      <v-spacer></v-spacer>

      <div style="min-height: 60px">
        <client-only>
          <apex-chart
            class="chart"
            height="60"
            :options="chartOptions"
            :series="series"
          />
        </client-only>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
    current: {
      type: String,
      required: false,
      default: null,
    },
    options: {
      type: Object,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { options: chartOptions } = toRefs(props)
    const { $vuetify } = useContext()

    const options = computed(() => ({
      ...chartOptions.value,
      ...{
        theme: {
          mode: $vuetify.theme.dark ? 'dark' : 'light',
        },
      },
    }))

    return { chartOptions: options }
  },
})
</script>

<style lang="scss">
@import '~/assets/styles/variables.scss';

.chart svg {
  border-bottom-left-radius: $border-radius-root;
  border-bottom-right-radius: $border-radius-root;
}
</style>

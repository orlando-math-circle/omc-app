<template>
  <v-card>
    <v-card-title v-text="title"></v-card-title>

    <div class="d-flex flex-column flex-grow-1">
      <div class="px-2 pb-2">
        <div class="d-flex align-center">
          <h4 v-text="current"></h4>
          <v-spacer></v-spacer>
          <div class="d-flex flex-column text-right" v-text="subtitle"></div>
        </div>
      </div>

      <v-spacer></v-spacer>

      <div style="min-height: 60px">
        <client-only>
          <apexchart
            height="60"
            :options="options"
            :series="series"
          ></apexchart>
        </client-only>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class ChartCard extends Vue {
  @Prop() title!: string
  @Prop() subtitle!: string
  @Prop() icon?: string
  @Prop() current?: string
  @Prop() options!: Object
  @Prop() series!: Object
}
</script>

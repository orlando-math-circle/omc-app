<template>
  <v-row no-gutters class="mb-6">
    <v-col>
      <v-row>
        <v-col>
          <h1>{{ title }}</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="pt-0">
          <breadcrumbs class="pa-0" :items="breadcrumbs" />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="auto" align-self="center">
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

export type Breadcrumb = {
  text: string
  href?: string
}

@Component
export default class AdminHeader extends Vue {
  @Prop({ required: true, type: String }) title!: string
  @Prop({ required: true }) breadcrumbs!: Breadcrumb[]
}
</script>

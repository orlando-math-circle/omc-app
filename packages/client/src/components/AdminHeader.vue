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
import { defineComponent, PropType } from '@nuxtjs/composition-api'

export type Breadcrumb = {
  text: string
  href?: string
}

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    breadcrumbs: {
      type: Array as PropType<Breadcrumb[]>,
      required: true,
    },
  },
})
</script>

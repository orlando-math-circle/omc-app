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
          <Breadcrumbs class="pa-0" :items="breadcrumbs" />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="auto" align-self="center">
      <slot />
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
    breadcrumbs: {
      type: Array as PropType<Breadcrumb[]>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
})
</script>

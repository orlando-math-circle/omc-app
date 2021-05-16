<template>
  <v-breadcrumbs :items="items" v-bind="$attrs">
    <template #item="{ item }">
      <nuxt-link v-if="item.href" :to="item.href" class="breadcrumb">
        {{ item.text }}
      </nuxt-link>
      <span v-else class="breadcrumb">
        {{ item.text }}
      </span>
    </template>
  </v-breadcrumbs>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  font-weight: 600 !important;
}
</style>

<template>
  <v-breadcrumbs :items="items" v-bind="$attrs">
    <template #item="{ item }">
      <NuxtLink v-if="item.href" :to="item.href" class="breadcrumb">
        {{ item.text }}
      </NuxtLink>

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

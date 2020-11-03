<template>
  <v-container class="pa-6"></v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Edit Project',
  },
})
export default class AdminProjectEditPage extends Vue {}
</script>

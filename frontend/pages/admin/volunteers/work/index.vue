<template>
  <v-container class="pa-6"> </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Jobs',
  },
})
export default class AdminWorksPage extends Vue {}
</script>

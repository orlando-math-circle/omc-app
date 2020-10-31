<template>
  <v-container class="pa-6">
    <v-card>
      <v-row>
        <v-col> </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'admin',
  head: {
    title: 'Files',
  },
})
export default class FilesPage extends Vue {}
</script>

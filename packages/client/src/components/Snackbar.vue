<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout">
    {{ text }}

    <template #action="{ attrs }">
      <v-btn icon v-bind="attrs" @click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Snackbar extends Vue {
  show = false
  timeout = null as number | null

  get text() {
    return this.$accessor.snackbar.text
  }

  get color() {
    return this.$accessor.snackbar.color
  }

  created() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'snackbar/setSnack') {
        this.timeout = this.$accessor.snackbar.timeout
        this.show = true
      }
    })
  }
}
</script>

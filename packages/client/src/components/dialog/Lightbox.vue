<template>
  <v-dialog v-model="dialog">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </slot>
    </template>

    <v-img :src="image" @click="dialog = false">
      <v-toolbar flat class="picture--toolbar">
        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-sheet class="pa-2 rounded">
            <v-icon>mdi-close</v-icon>
          </v-sheet>
        </v-btn>
      </v-toolbar>
    </v-img>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DialogLightbox extends Vue {
  @Prop() readonly image!: string

  dialog = false
}
</script>

<style lang="scss">
.picture--toolbar {
  background-color: transparent !important;
}
</style>

<template>
  <v-dialog max-width="440">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>

    <v-card>
      <v-card-title>Color picker</v-card-title>

      <v-card-text>
        <v-color-picker
          :value="value"
          hide-mode-switch
          mode="hexa"
          @input="$emit('input', $event || null)"
        >
        </v-color-picker>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn>Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class DialogColorPicker extends Vue {
  @Prop({ required: true }) value!: string

  dialog = false

  open() {
    this.dialog = true
  }
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="expands ? $vuetify.breakpoint.mobile : false"
    :max-width="width"
    persistent
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">Add Event</v-btn>
      </slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>
          <slot name="title"></slot>
        </v-toolbar-title>
        <v-btn small absolute right fab icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-subtitle>
        <slot name="subtitle"></slot>
      </v-card-subtitle>

      <v-form-validated v-slot="data" @submit:form="submit">
        <slot v-bind="{ ...data, closing }"></slot>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class DialogForm extends Vue {
  @Prop({ default: 540 }) width?: number
  @Prop({ default: true }) expands!: boolean

  dialog = false
  closing = false

  close(delay?: number) {
    if (delay) {
      this.closing = true
      setTimeout(() => (this.dialog = false), delay)
      return
    }

    this.dialog = false
  }

  submit() {
    this.$emit('submit:form')
  }
}
</script>

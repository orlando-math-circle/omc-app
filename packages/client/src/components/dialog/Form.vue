<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="expands ? $vuetify.breakpoint.mobile : false"
    :max-width="width"
    persistent
    @input="onInput"
    @click:outside="handler"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" color="secondary" v-on="on">Create</v-btn>
      </slot>
    </template>

    <v-card @mousedown="setMouseDown">
      <v-toolbar flat>
        <v-toolbar-title>
          <slot name="title"></slot>
        </v-toolbar-title>
        <v-btn small absolute right fab icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-subtitle v-if="$slots.footer">
        <slot name="subtitle"></slot>
      </v-card-subtitle>

      <slot name="image"></slot>

      <v-form-validated v-slot="data" @submit:form="submit">
        <slot v-bind="{ ...data, closing }"></slot>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

@Component
export default class DialogForm extends Vue {
  @Prop({ default: 570 }) width?: number
  @Prop({ default: true }) expands!: boolean

  dialog = false
  closing = false
  downInner = false

  onInput(value: boolean) {
    this.$emit('dialog:state', value)
  }

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

  @Watch('dialog')
  watchDialog() {
    this.downInner = false
  }

  setMouseDown() {
    this.downInner = true
  }

  handler() {
    if (this.downInner === false) {
      this.dialog = false
    }
    this.downInner = false
  }
}
</script>

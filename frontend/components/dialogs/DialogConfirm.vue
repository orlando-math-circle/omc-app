<template>
  <v-dialog v-model="dialog" max-width="440px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn color="secondary" @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class DialogConfirm extends Vue {
  @Prop({ default: 'Are you sure?' }) title!: string

  dialog = false
  value: any = null

  public open(value: any) {
    this.value = value
    this.dialog = true
  }

  public confirm() {
    this.$emit('confirm', this.value)
    this.dialog = false
  }
}
</script>

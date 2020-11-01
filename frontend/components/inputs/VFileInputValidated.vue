<template>
  <ValidationProvider v-slot="{ errors }" :vid="vid" :rules="rules">
    <v-file-input
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
      @change="onChange"
    >
      <template
        v-for="(_, scopedSlotName) in $scopedSlots"
        v-slot:[scopedSlotName]="slotData"
      >
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>

      <template v-for="(_, slotName) in $slots" v-slot:[slotName]>
        <slot :name="slotName" />
      </template>
    </v-file-input>
  </ValidationProvider>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { ValidationProvider } from 'vee-validate'

@Component({
  components: {
    ValidationProvider,
  },
})
export default class VFileInputValidated extends Vue {
  @Prop({ default: '' }) rules!: string | object
  @Prop() vid?: string

  onChange(value: File) {
    this.$emit('input', value)
  }
}
</script>

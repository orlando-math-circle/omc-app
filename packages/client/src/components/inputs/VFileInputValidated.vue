<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-file-input
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
      @change="onChange"
    >
      <template
        v-for="(_, scopedSlotName) in $scopedSlots"
        #[scopedSlotName]="slotData"
      >
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>

      <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName" />
      </template>
    </v-file-input>
  </validation-provider>
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

<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-select
      v-model="data"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
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
    </v-select>
  </validation-provider>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'
import { ValidationProvider } from 'vee-validate'

@Component({
  components: {
    ValidationProvider,
  },
})
export default class VTextFieldValidated extends Vue {
  @PropSync('value') data!: string | number | object
  @Prop({ default: '' }) rules!: string | object
  @Prop() vid?: string
}
</script>

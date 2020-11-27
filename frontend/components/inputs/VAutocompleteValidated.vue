<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-autocomplete
      :value="value"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
      @input="$emit('input', $event)"
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
    </v-autocomplete>
  </validation-provider>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ValidationProvider } from 'vee-validate'

@Component({
  components: {
    ValidationProvider,
  },
})
export default class VAutocompleteValidated extends Vue {
  @Prop() value!: any
  @Prop({ default: '' }) rules!: string | object
  @Prop() vid?: string
}
</script>

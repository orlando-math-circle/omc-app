<template>
  <ValidationProvider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-text-field
      v-model="text"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-text-field>
  </ValidationProvider>
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
  @PropSync('value') text!: string
  @Prop({ default: '' }) rules!: string | object
  @Prop() vid?: string
}
</script>

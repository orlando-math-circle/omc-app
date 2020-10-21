<template>
  <ValidationProvider v-slot="{ errors }" :vid="vid" :rules="rules">
    <v-select
      v-model="data"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-select>
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
  @PropSync('value') data!: string | number | object
  @Prop({ default: '' }) rules!: string | object
  @Prop() vid?: string
}
</script>

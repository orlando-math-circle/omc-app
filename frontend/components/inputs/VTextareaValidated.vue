<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-textarea
      v-model="text"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </validation-provider>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { ValidationProvider } from 'vee-validate'

@Component({
  components: {
    ValidationProvider,
  },
})
export default class VTextareaValidated extends Vue {
  @PropSync('value') text!: string
  @Prop({ default: '' }) rules!: string | object
  @Prop() vid?: string
}
</script>

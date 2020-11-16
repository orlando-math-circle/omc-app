<template>
  <validation-provider
    v-slot="{ errors }"
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
  >
    <v-checkbox
      v-model="val"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    >
    </v-checkbox>
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
export default class VCheckboxValidated extends Vue {
  @Prop() value!: boolean
  @Prop({ default: '' }) rules!: string | object
  @Prop() vid?: string

  get val() {
    return this.value
  }

  set val(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

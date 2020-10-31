<template>
  <ValidationObserver v-slot="{ passes, passed }" ref="observer">
    <v-form ref="form" @submit.prevent="passes(submit)">
      <slot v-bind="{ passes, passed }"></slot>
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ValidationObserver } from 'vee-validate'

@Component({
  components: {
    ValidationObserver,
  },
})
export default class VFormValidated extends Vue {
  submit() {
    this.$emit('submit:form')
  }
}
</script>

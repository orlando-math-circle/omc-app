<template>
  <ValidationObserver v-slot="attrs" ref="observer">
    <v-form ref="form" @submit.prevent="attrs.passes(submit)">
      <slot v-bind="attrs" />
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { ValidationObserver } from 'vee-validate'

export default defineComponent({
  components: {
    ValidationObserver,
  },
  setup(_, { emit }) {
    const observer = ref<InstanceType<typeof ValidationObserver>>()

    const submit = () => emit('form:submit')

    const resetValidation = () => {
      observer.value!.reset()
    }

    return { resetValidation, submit, observer }
  },
})
</script>

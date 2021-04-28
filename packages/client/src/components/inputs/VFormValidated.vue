<template>
  <validation-observer v-slot="{ valid, passes, passed }" ref="observer">
    <v-form ref="form" @submit.prevent="passes(submit)">
      <slot v-bind="{ valid, passes, passed }"></slot>
    </v-form>
  </validation-observer>
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

    const submit = () => {
      emit('submit:form')
    }

    const reset = () => {
      observer.value!.reset()
    }

    return { submit, reset, observer }
  },
})
</script>

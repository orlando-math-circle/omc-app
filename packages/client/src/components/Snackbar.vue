<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout">
    {{ message }}

    <template #action="{ attrs }">
      <v-btn icon v-bind="attrs" @click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { useSnackbar } from '@/stores'
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const snackbar = useSnackbar()

    const show = computed({
      get() {
        return snackbar.show
      },
      set(value: boolean) {
        snackbar.show = value
      },
    })

    return {
      show,
      message: computed(() => snackbar.message),
      color: computed(() => snackbar.color),
      timeout: computed(() => snackbar.timeout),
    }
  },
})
</script>

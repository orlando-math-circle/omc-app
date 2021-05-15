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
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { useSnackbar } from '@/store/useSnackbar'

export default defineComponent({
  setup() {
    const snackbar = useSnackbar()

    const show = ref(false)
    const timeout = ref<number | null>(null)

    watch(
      () => snackbar.message,
      () => {
        timeout.value = snackbar.timeout
        show.value = true
      }
    )

    return {
      show,
      timeout,
      message: computed(() => snackbar.message),
      color: computed(() => snackbar.color),
    }
  },
})
</script>

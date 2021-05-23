<template>
  <v-card>
    <v-card-title>Test State</v-card-title>

    <v-card-text>
      <pre>{{ JSON.stringify(state, null, 2) }}</pre>
    </v-card-text>

    <v-card-actions>
      <v-btn @click="userAction">User Action</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useAuth } from '@/stores'

export default defineComponent({
  setup() {
    const authStore = useAuth()

    const state = computed(() => ({
      status: authStore.status,
      isLoading: authStore.isLoading,
    }))

    return {
      state,
      userAction: () => authStore.getMyUser(),
    }
  },
})
</script>

<template>
  <v-card>
    <v-card-title>Test State</v-card-title>

    <v-card-text>
      <pre>{{ JSON.stringify(state, null, 2) }}</pre>
    </v-card-text>

    <v-card-actions>
      <v-btn @click="userAction">User Action</v-btn>
    </v-card-actions>

    <!-- <v-dialog v-model="dialog">
      <template #activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" @click="dialog = !dialog">Editor</v-btn>
      </template>

      <v-card> -->
    <client-only>
      <Editor v-model="text" />
    </client-only>
    <!-- </v-card>
    </v-dialog> -->
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { useAuth } from '@/stores'

export default defineComponent({
  setup() {
    const dialog = ref(false)
    const text = ref('')

    const authStore = useAuth()

    const state = computed(() => ({
      status: authStore.status,
      isLoading: authStore.isLoading,
    }))

    return {
      state,
      dialog,
      text,
      userAction: () => authStore.getMyUser(),
    }
  },
})
</script>

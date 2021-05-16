<template>
  <v-card>
    <v-card-title>Test State</v-card-title>

    <v-card-text>
      <pre>{{
        JSON.stringify(
          { loading: store.isLoading, status: store.status },
          null,
          2
        )
      }}</pre>
    </v-card-text>

    <v-card-actions>
      <v-btn @click="userAction">User Action</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useUsers } from '@/store/useUsers'

export default defineComponent({
  setup() {
    const userStore = useUsers()

    console.log(userStore.isLoading)

    return {
      store: userStore,
      userAction: () => userStore.findAll(),
    }
  },
})
</script>

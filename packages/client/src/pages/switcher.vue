<template>
  <div style="height: 100%">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container v-if="account">
      <v-row>
        <v-col>
          <h2>Select a User</h2>
        </v-col>
      </v-row>

      <v-row v-for="user in account.users" :key="user.id">
        <v-col justify="center" align="center" @click="onSwitch(user.id)">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-avatar
                rounded
                size="125"
                class="elevation-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-img :src="user.avatarUrl" />
              </v-avatar>
            </template>
            <span>{{ user.name }}</span>
          </v-tooltip>

          <div class="py-2">{{ user.name }}</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useRouter } from '@nuxtjs/composition-api'
import { useAuth } from '@/store/useAuth'

export default defineComponent({
  layout: 'landing',
  setup() {
    const authStore = useAuth()
    const router = useRouter()

    const onSwitch = async (id: number) => {
      await Promise.all([authStore.switchUser(id), authStore.getMyUser()])

      router.push('/home')
    }

    return {
      account: computed(() => authStore.account),
      onSwitch,
    }
  },
  async asyncData({ pinia }) {
    const authStore = useAuth(pinia)

    await authStore.getMyAccount()
  },
  head: {
    title: 'Switch User',
  },
})
</script>

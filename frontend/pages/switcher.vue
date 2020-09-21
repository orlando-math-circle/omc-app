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
        <v-col justify="center" align="center" @click="switchUser(user)">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-avatar
                rounded
                size="125"
                class="elevation-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-img
                  :src="user.avatar || '/images/default_avatars/pig.png'"
                />
              </v-avatar>
            </template>
            <span>{{ user.first }} {{ user.last }}</span>
          </v-tooltip>

          <div class="py-2">{{ user.first }} {{ user.last }}</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: 'landing',
  async fetch() {
    this.account = await this.$axios.$get('/account/me')
  },
  data() {
    return {
      account: null,
    }
  },
  methods: {
    async switchUser(user) {
      try {
        await this.$store.dispatch('auth/switchUser', user.id)

        this.$router.push('/landing')
      } catch (error) {
        console.log(error)
      }
    },
  },
  head: {
    title: 'Switch User',
  },
}
</script>

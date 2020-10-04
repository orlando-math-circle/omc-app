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

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { User } from '~/../backend/src/user/user.entity'

@Component({
  layout: 'landing',
  head() {
    return {
      title: 'Switch User',
    }
  },
})
export default class SwitcherPage extends Vue {
  get account() {
    return this.$accessor.auth.account
  }

  async fetch() {
    await this.$accessor.auth.getAccount()
  }

  async switchUser(user: User) {
    await this.$accessor.auth.switchUser(user.id)
    this.$router.push('/home')
  }
}
</script>

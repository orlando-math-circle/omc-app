<template>
  <div>
    <v-row>
      <v-col justify="center" align="center"> </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-avatar size="120px" class="avatar">
          <v-img
            :src="user.avatar || '/images/default_avatars/paper.png'"
          ></v-img>
        </v-avatar>

        <v-card class="pa-3 avatar-offset">
          <v-card-title>User Settings</v-card-title>

          <v-card-text>
            <v-text-field v-model="user.email" label="email"></v-text-field>

            <v-text-field label="Change Password"></v-text-field>
            <v-text-field label="Confirm New Password"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn block color="primary"> Update User</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card v-if="account" class="pa-3">
          <v-card-title class="mt-3"> Account Users </v-card-title>

          <v-card-subtitle> Manage users. </v-card-subtitle>

          <v-card-text>
            <v-list>
              <v-list-item v-for="usr in otherUsers" :key="usr.id">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ usr.first }} {{ usr.last }}
                  </v-list-item-title>
                  <v-list-item-subtitle></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon>
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-btn block color="primary">Add User</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  async fetch() {
    this.account = await this.$axios.$get('/account/me')
  },
  data() {
    return {
      account: null,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    otherUsers() {
      return this.account.users.filter((user) => user.id !== this.user.id)
    },
  },
  head: {
    title: 'Account',
  },
}
</script>

<style lang="scss" scoped>
.avatar {
  border: 4px solid #fff;
  position: absolute;
  top: 0%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;

  &-offset {
    margin-top: 40px;
  }
}
</style>

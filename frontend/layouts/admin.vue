<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      dark
      app
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="user.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ user.first }} {{ user.last }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ user.email }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link exact to="/admin/">
          <v-list-item-icon>
            <v-icon>mdi-home-analytics</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/users">
          <v-list-item-icon>
            <v-icon>mdi-account-box</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/events">
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Events</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/courses">
          <v-list-item-icon>
            <v-icon>mdi-school</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Courses</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/projects">
          <v-list-item-icon>
            <v-icon>mdi-palette</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Projects</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/volunteers">
          <v-list-item-icon>
            <v-icon>mdi-hand-heart</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Volunteers</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/volunteers">
          <v-list-item-icon>
            <v-icon>mdi-cloud-upload</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Uploads</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link to="/" exact>
          <v-list-item-icon>
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Return to Site</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="$store.dispatch('auth/logout')">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat app color="primary">
      <v-toolbar-title class="title">OMC Admin</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Roles } from '~/../backend/src/app.roles'

export default Vue.extend({
  middleware: 'auth',
  data() {
    return {
      drawer: false,
      mini: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  meta: {
    auth: {
      roles: [Roles.ADMIN],
    },
  },
})
</script>

<style lang="scss" scoped>
.title {
  color: #fff;
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  text-align: center;
  font-size: 1.5em;
  font-weight: 700;
}
</style>

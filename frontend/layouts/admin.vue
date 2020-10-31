<template>
  <v-app>
    <v-navigation-drawer
      v-if="user != null"
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

      <v-list nav dense>
        <v-list-item link exact to="/admin/">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-subheader>Entities</v-subheader>

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

        <v-list-item link @click="$accessor.auth.logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#fff" light>
      <v-app-bar-nav-icon @click="mini = !mini"></v-app-bar-nav-icon>
      <v-toolbar-title class="title">OMC Admin</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="$accessor.auth.logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="isDark = !isDark">
            <v-list-item-title>{{
              isDark ? 'Switch to Light' : 'Switch to Dark'
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: ['auth', 'admin'],
})
export default class AdminLayout extends Vue {
  drawer = false
  mini = false

  get user() {
    return this.$accessor.auth.user
  }

  get isDark() {
    return this.$vuetify.theme.dark
  }

  set isDark(value: boolean) {
    this.$vuetify.theme.dark = value
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  font-size: 1.5em;
  font-weight: 700;
}
</style>

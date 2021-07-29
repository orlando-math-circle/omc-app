<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="user.avatarUrl" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ user.first }} {{ user.last }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ user.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list nav dense>
        <v-list-item link exact to="/admin/" active-class="primary--text">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt to="/admin/users" active-class="primary--text">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt to="/admin/logs" active-class="primary--text">
          <v-list-item-icon>
            <v-icon>mdi-history</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Activity Records</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group prepend-icon="mdi-calendar-month">
          <template #activator>
            <v-list-item-title>Calendar</v-list-item-title>
          </template>

          <v-list-item link to="/admin/calendar/events">
            <v-list-item-icon>
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Events</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/admin/calendar/registrations">
            <v-list-item-icon>
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Registrations</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/admin/calendar/courses">
            <v-list-item-icon>
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Courses</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/admin/calendar/projects">
            <v-list-item-icon>
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Projects</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="mdi-food-apple-outline">
          <template #activator>
            <v-list-item-title>Volunteers</v-list-item-title>
          </template>

          <v-list-item link to="/admin/volunteers/jobs">
            <v-list-item-icon>
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Jobs</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/admin/volunteers/work">
            <v-list-item-icon>
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Work</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="mdi-paperclip">
          <template #activator>
            <v-list-item-title>Files</v-list-item-title>
          </template>

          <v-list-item link to="/admin/files/attachments">
            <v-list-item-icon>
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Attachments</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/admin/files/lunch">
            <v-list-item-icon>
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Reduced Lunch Form</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-divider />

        <v-list-item link to="/" exact>
          <v-list-item-icon>
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Return to Site</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="onLogout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat class="appbar">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="title">Orlando Math Circle</v-toolbar-title>

      <v-spacer />

      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" icon elevation="2" v-on="on">
            <v-avatar>
              <v-img :src="user.avatarUrl" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list dense nav>
          <v-list-item link to="/dashboard">
            <v-list-item-icon>
              <v-icon>mdi-account-box-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="isDark = !isDark">
            <v-list-item-icon>
              <v-icon>{{
                isDark
                  ? 'mdi-lightbulb-on-outline'
                  : 'mdi-lightbulb-off-outline'
              }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{
                isDark ? 'Light Mode' : 'Dark Mode'
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-list-item link @click="onLogout">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <Snackbar />
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useRouter,
} from '@nuxtjs/composition-api'
import { useDarkMode } from '@/composables'
import { useAuth } from '@/stores'

export default defineComponent({
  middleware: ['auth', 'admin'],
  setup() {
    const isDark = useDarkMode()
    const authStore = useAuth()
    const router = useRouter()

    const drawer = ref(false)

    const onLogout = () => {
      authStore.logout()
      router.push('/')
    }

    return {
      drawer,
      user: computed(() => authStore.user!),
      isDark,
      onLogout,
    }
  },
  head: {
    title: 'Admin Dashboard',
  },
})
</script>

<style lang="scss">
.appbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

// VList
.v-list-item__action:first-child,
.v-list-item__icon:first-child {
  margin-right: 14px !important;
}

// VDataTable
.v-data-table table tbody tr {
  transition: box-shadow 0.2s, transform 0.2s;
}

.v-data-table table tbody tr:not(.v-data-table__selected):hover {
  box-shadow: 0 3px 15px -2px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #fff !important;
}
</style>

<style lang="scss" scoped>
.title {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  font-size: 1.5em;
  font-weight: 700;
}

.admin-enter-active,
.admin-leave-active {
  transition: opacity 0.005s;
}
.admin-enter,
.admin-leave-active {
  opacity: 0;
}
</style>

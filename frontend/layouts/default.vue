<template>
  <v-app dark class="wave">
    <v-navigation-drawer v-model="drawer" fixed temporary app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat absolute app class="wave-bar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title class="title"> Orlando Math Circle </v-toolbar-title>

      <v-spacer />

      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="isAdmin" link to="/admin">
            <v-list-item-title>Admin Panel</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="$router.push('/switcher')">
            <v-list-item-title>Switch User</v-list-item-title>
          </v-list-item>

          <v-list-item @click="isDark = !isDark">
            <v-list-item-title>{{
              isDark ? 'Switch to Light' : 'Switch to Dark'
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main app>
      <v-container>
        <div class="wave-after">
          <nuxt />
        </div>
      </v-container>
    </v-main>

    <v-bottom-navigation app class="bottom-navigation">
      <v-btn v-for="item in items" :key="item.title" :to="item.to">
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  middleware: 'auth',
})
export default class DefaultLayout extends Vue {
  drawer = false
  fixed = false
  items = [
    {
      icon: 'mdi-home',
      title: 'Home',
      to: '/home',
    },
    {
      icon: 'mdi-calendar-star',
      title: 'Events',
      to: '/events',
    },
    {
      icon: 'mdi-puzzle',
      title: 'Projects',
      to: '/projects',
    },
    {
      icon: 'mdi-account-circle',
      title: 'Account',
      to: '/account',
    },
  ]

  get isAdmin() {
    return this.$store.getters['auth/isAdmin']
  }

  get isDark() {
    return this.$vuetify.theme.dark
  }

  set isDark(value: boolean) {
    this.$vuetify.theme.dark = value
  }

  async fetch() {
    if (this.$accessor.auth.user) return

    await this.$store.dispatch('auth/getMe')
  }

  logout() {
    this.$accessor.auth.logout()
    this.$router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.page-enter-active,
.page-leave-active {
  transition-property: opacity;
  transition-timing-function: ease-in-out;
  transition-duration: 250ms;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}

.title {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  text-align: center;
  font-size: 1.5em;
  font-weight: 700;
}

.wave {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: block;
    height: 70vw;
    background-size: cover;
    background-image: url('~assets/images/welcome-wave.svg');
  }

  &-bar {
    background-color: transparent !important;
  }
}

.top-wave {
  position: relative;
  background-color: transparent;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('~assets/backgrounds/cyan-wave.svg');
    background-repeat: no-repeat;
    background-size: 200%;
  }
}

.wave-after {
  position: relative;
  background-color: transparent;
  z-index: 1;
}

.bottom-navigation {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
</style>

<template>
  <v-app dark class="wave-container">
    <div class="wave">
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

        <v-toolbar-title class="title" v-text="title" />

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

      <v-main>
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
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Default',
  middleware: 'auth',
  async fetch() {
    await this.$store.dispatch('auth/getMe')
  },
  data() {
    return {
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/landing',
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
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Orlando Math Circle',
    }
  },
  computed: {
    isAdmin() {
      // console.log(this.$auth)
      // return this.$auth.loggedIn && this.$auth.user && this.$auth.user.roles
      //   ? this.$auth.user.roles.includes('admin')
      //   : false
      return false
    },
    isDark: {
      get() {
        return this.$vuetify.theme.dark
      },
      set() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      },
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')

      this.$router.push('/')
    },
  },
})
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: block;
  height: 70vw;
  background-size: cover;
  background-image: url('~assets/images/welcome-wave.svg');

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

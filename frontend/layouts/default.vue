<template>
  <v-app dark>
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

    <v-app-bar flat absolute app>
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
          <v-list-item @click="$auth.logout()">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="isAdmin" link to="/admin">
            <v-list-item-title>Admin Panel</v-list-item-title>
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
      <v-container class="top-wave">
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

<script>
export default {
  name: 'Default',
  middleware: 'auth',
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
      return this.$auth.loggedIn
        ? this.$auth.user.roles.includes('admin')
        : false
    },
    isDark: {
      get() {
        return this.$vuetify.theme.isDark
      },
      set() {
        this.$vuetify.theme.isDark = !this.$vuetify.theme.isDark
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: center;
  font-size: 1.5em;
  font-weight: 700;
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

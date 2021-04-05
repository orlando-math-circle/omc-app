<template>
  <v-app dark class="wave">
    <v-navigation-drawer v-model="drawer" fixed temporary app>
      <v-list nav dense>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          link
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

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

      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list dense nav>
          <v-list-item link to="/switcher">
            <v-list-item-icon>
              <v-icon>mdi-account-switch-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Switch User</v-list-item-title>
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

          <template v-if="isAdmin">
            <v-divider />

            <v-list-item v-if="isAdmin" link to="/admin">
              <v-list-item-icon>
                <v-icon>mdi-view-dashboard-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-title>Admin Panel</v-list-item-title>
            </v-list-item>
          </template>

          <v-divider />

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main app>
      <v-container>
        <div class="wave-after">
          <v-alert
            v-if="user && user.email && !user.emailVerified"
            type="info"
            elevation="2"
            color="#4f84fb"
            dismissible
          >
            Thank you for registering! Please click the link in the verification
            email to confirm your account so you may register to events.
            <a @click="resend">Resend the verification email</a>.<br /><br />
            In the meantime you may
            <nuxt-link to="/account/settings"
              >add users to your account</nuxt-link
            >.
          </v-alert>
          <nuxt />
        </div>
      </v-container>
    </v-main>

    <v-bottom-navigation
      app
      class="bottom-navigation"
      active-class="primary--text"
    >
      <v-btn v-for="item in items" :key="item.title" :to="item.to">
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <snackbar></snackbar>
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
      to: '/account/settings',
    },
  ]

  get isAdmin() {
    return this.$accessor.auth.isAdmin
  }

  get isDark() {
    return this.$vuetify.theme.dark
  }

  set isDark(value: boolean) {
    this.$vuetify.theme.dark = value
    this.$cookies.set('omc-theme-dark', value)
  }

  get user() {
    return this.$accessor.auth.user
  }

  async fetch() {
    if (this.$accessor.auth.user) return

    await this.$store.dispatch('auth/getMe')
  }

  async resend() {
    await this.$accessor.auth.resendVerifyEmail()

    if (this.$accessor.auth.isErrored) {
      this.$accessor.snackbar.show({
        text: this.$accessor.auth.error!.message,
        timeout: 10000,
      })
    } else {
      this.$accessor.snackbar.show({
        text:
          'Verification Email Resent. You may change your email on the account page if you entered it incorrectly',
      })
    }
  }

  logout() {
    this.$accessor.auth.logout()
    this.$router.push('/')
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/global.scss';

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

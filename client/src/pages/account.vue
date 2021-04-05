<template>
  <div>
    <v-row>
      <v-col>
        <v-card class="avatar--offset">
          <avatar-picker :url="$avatar(user)" />

          <div class="d-flex flex-row">
            <v-spacer />

            <dialog-select-avatar
              v-slot="{ on, attrs }"
              :user="user"
              @update:avatar="onUpdateAvatar"
            >
              <v-btn text class="ma-2" v-bind="attrs" v-on="on">
                Edit Avatar
              </v-btn>
            </dialog-select-avatar>
          </div>

          <div class="d-flex flex-column align-center justify-center my-3">
            <div class="text-h4 user--name">{{ user.name }}</div>
            <div v-if="role" class="text-h5 user--role">{{ role }}</div>
          </div>

          <v-tabs show-arrows centered grow>
            <v-tab to="/account/settings">Settings</v-tab>
            <v-tab to="/account/invoices">Invoices</v-tab>
            <v-tab to="/account/forms">Forms</v-tab>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>

    <nuxt-child></nuxt-child>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Roles } from '@omc/server/app.roles'

@Component({
  head: {
    title: 'Account',
  },
  async fetch({ app: { $accessor } }) {
    await Promise.all([
      $accessor.auth.getAccount(),
      $accessor.files.findMyAttachments('REDUCED_LUNCH_FIELD'),
    ])
  },
})
export default class AccountPage extends Vue {
  get user() {
    return this.$accessor.auth.user!
  }

  get account() {
    return this.$accessor.auth.account!
  }

  get role() {
    if (!this.user || !this.user.roles) return

    return this.user.roles.includes(Roles.ADMIN)
      ? 'Administrator'
      : this.user.roles.includes(Roles.VOLUNTEER)
      ? 'Volunteer'
      : undefined
  }

  onUpdateAvatar() {
    this.$accessor.auth.getMe()
  }
}
</script>

<style lang="scss">
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 250ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>

<style lang="scss" scoped>
.user {
  &--name {
    font-weight: 600;
  }

  &--role {
    font-weight: 600;
    opacity: 0.6;
  }
}

::v-deep
  .v-select.v-select--chips:not(.v-text-field--single-line).v-text-field--enclosed
  .v-select__selections {
  min-height: 48px;
}
</style>

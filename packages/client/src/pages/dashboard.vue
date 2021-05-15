<template>
  <div>
    <v-row class="mb-2">
      <v-col>
        <v-card class="avatar--offset">
          <Avatar :url="user.avatarUrl" />

          <div class="d-flex flex-row">
            <v-spacer />

            <DialogSelectAvatar
              v-slot="{ on, attrs }"
              :user="user"
              @update:avatar="onUpdateAvatar"
            >
              <v-btn text right absolute class="ma-2" v-bind="attrs" v-on="on">
                Edit Avatar
              </v-btn>
            </DialogSelectAvatar>
          </div>

          <div
            class="d-flex flex-column align-center justify-center mb-3"
            style="margin-top: 70px"
          >
            <div class="text-h4 user--name">{{ user.name }}</div>
            <div v-if="role" class="text-h5 user--role">{{ role }}</div>
          </div>

          <v-tabs show-arrows centered grow class="tabs">
            <v-tab to="/dashboard" exact>Settings</v-tab>
            <v-tab v-if="isPrimaryUser" to="/dashboard/account">
              Account
            </v-tab>
            <v-tab to="/dashboard/invoices">Invoices</v-tab>
            <v-tab to="/dashboard/forms">Forms</v-tab>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>

    <NuxtChild :user="user" :account="account" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useAuth } from '@/store/useAuth'
import { useAttachments } from '@/store/useAttachments'

export default defineComponent({
  setup() {
    const authStore = useAuth()

    const onUpdateAvatar = () => {
      authStore.getMyUser()
      authStore.getMyAccount()
    }

    return {
      user: computed(() => authStore.user!),
      account: computed(() => authStore.account),
      role: computed(() => authStore.roleTitle),
      isPrimaryUser: computed(() => authStore.isPrimaryUser),
      onUpdateAvatar,
    }
  },
  async asyncData({ pinia }) {
    const auth = useAuth(pinia)
    const attachments = useAttachments(pinia)

    await Promise.all([
      auth.getMyAccount(),
      attachments.findAll('REDUCED_LUNCH_FIELD', true),
    ])
  },
  head: {
    title: 'Account',
  },
})
</script>

<style lang="scss">
.tabs {
  overflow: hidden;
}

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

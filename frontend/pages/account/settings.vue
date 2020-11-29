<template>
  <div>
    <v-card v-if="user.omcEmail" class="mb-4">
      <v-card-title>OMC Email</v-card-title>

      <v-card-subtitle>
        You have been given an OMC organization email.
      </v-card-subtitle>

      <v-card-text>
        <link-copy :text="user.omcEmail"></link-copy>
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title>Account Users</v-card-title>

      <v-card-subtitle>
        Create or manage users within your account.
      </v-card-subtitle>

      <v-list rounded>
        <v-list-item v-for="usr in users" :key="usr.id">
          <v-list-item-avatar>
            <v-img :src="$avatar(usr)" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              {{ usr.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <span>{{ gender(usr) }}</span>
              <span v-if="typeof usr.grade === 'number'">
                <v-icon x-small>mdi-circle-medium</v-icon>
                {{ grades[usr.grade].text }}
              </span>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-menu offset-y transition="slide-y-transition">
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-cog-outline</v-icon>
                </v-btn>
              </template>

              <v-list dense nav>
                <v-list-item @click="$refs.editDialog.open(usr)">
                  <v-list-item-icon>
                    <v-icon>mdi-account-edit</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  v-if="primary && primary.id !== usr.id"
                  @click="$refs.deleteDialog.open(usr)"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-delete-alert-outline</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>

        <dialog-create-user v-slot="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">Add User</v-btn>
        </dialog-create-user>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title>Notifications</v-card-title>

      <v-card-subtitle
        >Change the frequency and type of notification emails.</v-card-subtitle
      >

      <v-list class="mx-3">
        <v-list-item-group>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Upcoming Events</v-list-item-title>
              <v-list-item-subtitle
                >Newsletter-style emails.</v-list-item-subtitle
              >
            </v-list-item-content>

            <v-list-item-action>
              <v-checkbox :value="false"></v-checkbox>
            </v-list-item-action>
          </v-list-item>

          <v-divider />

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-select
                  label="Reminders"
                  :items="[
                    '1 Day Before',
                    '1 Week Before',
                    '1 Hour Before',
                    '15 Minutes Before',
                  ]"
                  chips
                  hide-details
                >
                </v-select>
              </v-list-item-title>
              <v-list-item-subtitle>Notification emails.</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-checkbox :value="false"></v-checkbox>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <dialog-confirm ref="deleteDialog" @confirm="onDeleteConfirm">
      Deleting a user is a permanent action and cannot be undone. If you need to
      correct any information on the account please contact an administrator.
    </dialog-confirm>
    <dialog-user-edit ref="editDialog"></dialog-user-edit>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '../../../backend/src/user/user.entity'
import { grades } from '../../utils/events'
import { genders } from '../../utils/constants'
import DialogUserEdit from '~/components/dialogs/DialogUserEdit.vue'
import DialogConfirm from '~/components/dialogs/DialogConfirm.vue'

@Component({
  head: {
    title: 'Account Settings',
  },
  transition: 'slide-left',
})
export default class AccountSettingsPage extends Vue {
  $refs!: {
    editDialog: InstanceType<typeof DialogUserEdit>
    deleteDialog: InstanceType<typeof DialogConfirm>
  }

  grades = grades
  genders = genders

  get user() {
    return this.$accessor.auth.user!
  }

  get users() {
    return ((this.$accessor.auth.account?.users as unknown) as User[]) || []
  }

  get primary() {
    return this.$accessor.auth.account?.primaryUser
  }

  gender(user: User) {
    return this.genders.find((gender) => gender.value === user.gender)?.text
  }

  async onDeleteConfirm(user: User) {
    await this.$accessor.users.delete(user.id)
    await this.$accessor.auth.getAccount()
  }
}
</script>

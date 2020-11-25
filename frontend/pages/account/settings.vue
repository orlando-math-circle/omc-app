<template>
  <div>
    <v-card class="mb-4">
      <v-card-title>Account Users</v-card-title>

      <v-card-subtitle>
        Create or manage users within your account.
      </v-card-subtitle>

      <v-list>
        <v-list-item v-for="usr in users" :key="usr.id">
          <v-list-item-avatar>
            <v-img :src="$avatar(usr)" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              {{ usr.first }} {{ usr.last }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="usr.grade !== 13"
              >Grade {{ usr.grade }}</v-list-item-subtitle
            >
            <v-list-item-subtitle v-else>Adult</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click="$refs.editDialog.open(usr)">
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>

            <v-btn icon @click="$refs.deleteDialog.open(usr)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>

        <dialog-user-create v-slot="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">Add User</v-btn>
        </dialog-user-create>
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
import { User } from '@backend/user/user.entity'
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

  get user() {
    return this.$accessor.auth.user
  }

  get users() {
    return this.$accessor.auth.account?.users || []
  }

  async onDeleteConfirm(user: User) {
    await this.$accessor.users.delete(user.id)
    await this.$accessor.auth.getAccount()
  }
}
</script>

<template>
  <v-card>
    <DialogConfirm ref="deleteDialog" @confirm="onDeleteConfirm">
      Deleting a user is a permanent action and cannot be undone. If you need to
      correct any information on the account please contact an administrator.
    </DialogConfirm>

    <DialogUpdateUser ref="editDialog" @user:update="onUpdateUser" />

    <v-card-title>Account Management</v-card-title>
    <v-card-subtitle>
      Add or manage child users on the account.
    </v-card-subtitle>

    <v-card-text>
      <v-list rounded>
        <v-list-item v-for="user in users" :key="user.id">
          <v-list-item-avatar>
            <v-img :src="user.avatarUrl" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>

            <v-list-item-subtitle>
              <span>{{ gender(user) }}</span>
              <span v-if="typeof user.grade === 'number'">
                <v-icon x-small>mdi-circle-medium</v-icon>
                {{ grades[user.grade].text }}
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
                <v-list-item @click="editDialog && editDialog.open(user)">
                  <v-list-item-icon>
                    <v-icon>mdi-account-edit</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  v-if="primary.id !== user.id"
                  @click="deleteDialog && deleteDialog.open(user)"
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
    </v-card-text>

    <v-card-actions>
      <DialogCreateUser>
        <template #activator="{ on, attrs }">
          <v-btn block rounded v-bind="attrs" v-on="on">Add User</v-btn>
        </template>
      </DialogCreateUser>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import { useAuth, UserEntity, useUsers } from '@/stores'
import DialogUpdateUser from '@/components/dialog/UpdateUser.vue'
import DialogConfirm from '@/components/dialog/Confirm.vue'
import { genders } from '@/utils/constants'
import { grades } from '@/utils/events'

export default defineComponent({
  transition(_to, from) {
    if (from?.name === 'dashboard') {
      return 'slide-right'
    }

    return 'slide-left'
  },
  setup() {
    const authStore = useAuth()
    const userStore = useUsers()

    const editDialog = ref<InstanceType<typeof DialogUpdateUser>>()
    const deleteDialog = ref<InstanceType<typeof DialogConfirm>>()

    const gender = (user: UserEntity) =>
      genders.find((gender) => gender.value === user.gender)?.text

    const onDeleteConfirm = async (user: UserEntity) => {
      await userStore.delete(user.id)
      await authStore.getMyAccount()
    }

    const onUpdateUser = async () => await authStore.getMyAccount()

    return {
      gender,
      grades,
      editDialog,
      deleteDialog,
      users: computed(() => authStore.accountUsers!),
      primary: computed(() => authStore.primaryUser!),
      onDeleteConfirm,
      onUpdateUser,
    }
  },
})
</script>

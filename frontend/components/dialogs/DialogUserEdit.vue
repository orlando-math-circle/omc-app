<template>
  <v-dialog v-model="dialog" max-width="440px">
    <v-card v-if="user == null">
      <v-card-title>Error</v-card-title>

      <v-card-text>User not found.</v-card-text>
    </v-card>

    <v-card v-else>
      <v-toolbar flat>
        <v-card-title>Edit {{ user.name }}</v-card-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form-validated v-slot="{ passes }" @submit:form="onSubmit">
        <v-card-text>
          <v-row>
            <v-col class="py-0">
              <v-text-field-validated
                v-model="dto.first"
                :value="user.first"
                label="First Name"
                rules="required"
                required
                outlined
              ></v-text-field-validated>
            </v-col>

            <v-col class="py-0">
              <v-text-field-validated
                v-model="dto.last"
                label="Last Name"
                rules="required"
                required
                outlined
              >
              </v-text-field-validated>
            </v-col>
          </v-row>

          <birthday-picker v-model="dto.dob" outlined></birthday-picker>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            type="submit"
            :disabled="!passes"
            :loading="isLoading"
            color="secondary"
          >
            Edit User
          </v-btn>
        </v-card-actions>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '@backend/user/user.entity'
// import { UpdateUserDto } from '@backend/user/dtos/update-user.dto'

@Component
export default class DialogUserEdit extends Vue {
  user = null as User | null
  dialog = false
  dto = {
    first: '',
    last: '',
    // grade: 0,
    dob: '',
    email: '' as string | undefined,
  }

  get isLoading() {
    return this.$accessor.users.isLoading || this.$accessor.auth.isLoading
  }

  public open(user: User) {
    if (!user) return

    this.user = user
    this.dto.first = user.first
    this.dto.last = user.last
    this.dto.dob = (user.dob as unknown) as string
    this.dto.email = user.email

    this.dialog = true
  }

  async onSubmit() {
    await this.$accessor.users.update({
      id: this.user!.id,
      updateUserDto: this.dto,
    })

    if (!this.$accessor.users.error) {
      if (this.$accessor.auth.user!.id === this.user!.id) {
        await this.$accessor.auth.getMe()
      }
      await this.$accessor.auth.getAccount()

      this.dialog = false
    }
  }
}
</script>

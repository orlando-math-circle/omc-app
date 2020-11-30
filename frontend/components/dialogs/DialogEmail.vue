<template>
  <dialog-form ref="dialog" @submit:form="onSubmit">
    <template #title>Email Users</template>
    <template #subtitle>
      Generate an email to the selected users. Note that users without emails
      are safely ignored.
    </template>

    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>

    <v-card-text>
      <v-col cols="12">
        <auto-complete-user v-model="internalUsers" item-value="id" multiple />
      </v-col>

      <v-col cols="12">
        <v-text-field-validated
          v-model="subject"
          label="Subject"
          rules="required"
          hide-details="auto"
          outlined
        ></v-text-field-validated>
      </v-col>

      <v-col cols="12">
        <v-textarea-validated
          v-model="body"
          label="Body"
          rules="required"
          outlined
          counter
        ></v-textarea-validated>
      </v-col>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text>Clear</v-btn>
      <v-btn type="submit" :loading="loading" color="secondary">Send</v-btn>
    </v-card-actions>
  </dialog-form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'nuxt-property-decorator'
import { CreateEmailDto } from '../../../backend/src/email/dto/create-email.dto'
import { DTOUser } from '../../store/users'
import DialogForm from './DialogForm.vue'

@Component
export default class DialogEmail extends Vue {
  @Ref('dialog') readonly dialog!: DialogForm
  @Prop() readonly users!: DTOUser[]

  subject = ''
  body = ''
  loading = false
  internalUsers: number[] = []

  @Watch('users', { immediate: true })
  onUsersChange(users: DTOUser[]) {
    this.internalUsers = users.map((u) => u.id)
  }

  async onSubmit() {
    try {
      this.loading = true

      const dto: CreateEmailDto = {
        userIds: this.internalUsers,
        subject: this.subject,
        body: this.body,
      }

      await this.$axios.$post('/email', dto)
    } catch (error) {
      this.$snack('An error occured attempting to email')
    } finally {
      this.loading = false
      this.$snack('Email Successfully Sent')
      this.dialog.close()
    }
  }
}
</script>

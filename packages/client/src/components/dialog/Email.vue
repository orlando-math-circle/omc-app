<template>
  <dialog-form ref="dialog" @form:submit="onSubmit" @dialog:close="reset">
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
        />
      </v-col>

      <v-col cols="12">
        <v-textarea-validated
          v-model="body"
          label="Body"
          rules="required"
          outlined
          counter
        />
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
import { CreateEmailDto } from '@server/email/dto/create-email.dto'
import { User } from '@server/user/user.entity'
import {
  defineComponent,
  PropType,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import DialogForm from '~/components/dialog/Form.vue'
import { useStateReset } from '~/composables/useStateReset'

export default defineComponent({
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
  },
  setup(props) {
    const { $axios, $snack } = useContext()
    const dialog = ref<InstanceType<typeof DialogForm>>()

    const { state, reset } = useStateReset({
      subject: '',
      body: '',
      loading: false,
      internalUsers: [] as number[],
    })

    watch(
      () => props.users,
      (users: User[]) => {
        state.internalUsers = users.map((u) => u.id)
      },
      { immediate: true }
    )

    const onSubmit = async () => {
      try {
        state.loading = true

        const dto: CreateEmailDto = {
          userIds: state.internalUsers,
          subject: state.subject,
          body: state.body,
        }

        await $axios.$post('/email', dto)
      } catch (error) {
        $snack('An error occured attempting to email')
      } finally {
        state.loading = false
        $snack('Email Successfully Sent')
        dialog.value!.close()
      }
    }

    return { dialog, reset, state, onSubmit }
  },
})
</script>

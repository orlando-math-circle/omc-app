<template>
  <DialogForm ref="dialog" @form:submit="onSubmit" @dialog:close="reset">
    <template #title>Email Users</template>

    <template #subtitle>
      Generate an email to the selected users. Note that users without emails
      are safely ignored.
    </template>

    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <v-card-text>
      <v-col cols="12">
        <AutocompleteUser v-model="userIds" multiple />
      </v-col>

      <v-col cols="12">
        <VTextFieldValidated
          v-model="subject"
          label="Subject"
          rules="required"
          hide-details="auto"
          outlined
        />
      </v-col>

      <v-col cols="12">
        <VTextareaValidated
          v-model="body"
          label="Body"
          rules="required"
          outlined
          counter
        />
      </v-col>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn text>Clear</v-btn>
      <v-btn type="submit" :loading="loading" color="secondary">Send</v-btn>
    </v-card-actions>
  </DialogForm>
</template>

<script lang="ts">
import { CreateEmailDto } from '@server/email/dto/create-email.dto'
import {
  defineComponent,
  PropType,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import DialogForm from '@/components/dialog/Form.vue'
import { UserEntity } from '@/stores'
import { useSnackbar, useStateReset } from '@/composables'

export default defineComponent({
  props: {
    users: {
      type: Array as PropType<UserEntity[]>,
      required: true,
    },
  },
  setup(props) {
    const { $axios } = useContext()
    const snackbar = useSnackbar()
    const dialog = ref<InstanceType<typeof DialogForm>>()

    const { state, reset } = useStateReset({
      subject: '',
      body: '',
      loading: false,
      userIds: [] as number[],
    })

    watch(
      () => props.users,
      (users: UserEntity[]) => {
        state.userIds = users.map((u) => u.id)
      },
      { immediate: true }
    )

    const onSubmit = async () => {
      try {
        state.loading = true

        const dto: CreateEmailDto = {
          userIds: state.userIds,
          subject: state.subject,
          body: state.body,
        }

        await $axios.$post('/email', dto)
      } catch (error) {
        snackbar.error('An error occured attempting to email')
      } finally {
        state.loading = false
        snackbar.success('Email Successfully Sent')
        dialog.value!.close()
      }
    }

    return { dialog, reset, state, onSubmit }
  },
})
</script>

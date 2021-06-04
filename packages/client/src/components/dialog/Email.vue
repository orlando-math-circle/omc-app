<template>
  <DialogForm
    ref="dialog"
    width="700"
    @form:submit="onSubmit"
    @dialog:close="reset"
  >
    <template #title>Email Users</template>

    <template #subtitle>
      Generate an email to the selected users. Note that users without emails
      are safely ignored.
    </template>

    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <div class="email-editor">
      <AutocompleteUser
        v-model="state.users"
        label="Email Recipients"
        multiple
        return-object
        :clearable="false"
        :outlined="false"
        chips
        deletable-chips
        solo
        flat
      >
        <!-- Disabled until implemented -->
        <!-- <template #append-outer>
          <v-btn icon> Cc </v-btn>

          <v-btn icon> Bcc </v-btn>
        </template> -->

        <template #item="{ item }">
          <template v-if="!item.email">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>No Email Address</v-list-item-subtitle>
            </v-list-item-content>
          </template>

          <template v-else>
            <v-list-item-avatar>
              <v-img :src="item.avatarUrl" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </AutocompleteUser>

      <v-divider />

      <VTextFieldValidated
        v-model="state.subject"
        label="Subject"
        rules="required"
        hide-details="auto"
        :outlined="false"
        solo
        flat
      />

      <client-only>
        <Editor v-model="state.html" />
      </client-only>

      <v-divider />
    </div>

    <v-card-actions>
      <v-spacer />

      <v-btn text>Clear</v-btn>
      <v-btn type="submit" :loading="state.loading" color="secondary">
        Send
      </v-btn>
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
      html: '',
      loading: false,
      users: [] as UserEntity[],
    })

    watch(
      () => props.users,
      (users: UserEntity[]) => {
        state.users = [...users]
      },
      { immediate: true }
    )

    const htmlToText = (html: string) => {
      const divEl = document.createElement('div')

      divEl.innerHTML = html

      return divEl.textContent || divEl.innerText || ''
    }

    const onSubmit = async () => {
      try {
        state.loading = true

        const dto: CreateEmailDto = {
          emails: state.users.map((u) => u.email!),
          subject: state.subject,
          html: state.html,
          text: htmlToText(state.html),
        }

        await $axios.$post('/email', dto)
        snackbar.success('Email Successfully Sent')
        dialog.value!.close()
      } catch (error) {
        snackbar.error('An error occured attempting to email')
      } finally {
        state.loading = false
      }
    }

    return { dialog, reset, state, onSubmit }
  },
})
</script>

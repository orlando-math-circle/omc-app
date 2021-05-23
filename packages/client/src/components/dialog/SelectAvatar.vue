<template>
  <v-dialog v-model="dialog" max-width="440px">
    <template #activator="activator">
      <slot v-bind="activator"></slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Select Avatar</v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <template v-if="custom">
          <FileUpload v-model="file" outlined label="Upload Avatar" />

          <v-divider class="my-3" />
        </template>

        <v-item-group v-model="selected" mandatory>
          <v-row wrap>
            <v-col
              v-for="avatar in avatars"
              :key="avatar"
              class="d-flex justify-center"
              cols="6"
              md="3"
              sm="4"
            >
              <v-item v-slot="{ active, toggle }">
                <v-card class="d-flex align-center" @click="toggle">
                  <v-img :src="avatarToImage(avatar)" class="rounded">
                    <v-scroll-y-transition>
                      <div v-if="active" class="active rounded">Selected</div>
                    </v-scroll-y-transition>
                  </v-img>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn :loading="isLoading" color="primary" @click="onSubmit">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { DefaultAvatar } from '@server/user/enums/default-avatar.enum'
import { User } from '@server/user/user.entity'
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  useContext,
  toRefs,
} from '@nuxtjs/composition-api'
import { useUsers, useFiles } from '@/stores'
import { useSnackbar } from '@/composables'

export default defineComponent({
  props: {
    custom: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { $config: config } = useContext()
    const snackbar = useSnackbar()
    const userStore = useUsers()
    const fileStore = useFiles()

    const state = reactive({
      dialog: false,
      selected: 0,
      file: null as File | string | null,
      avatars: [...Array(10).keys()].map((k) =>
        k.toString()
      ) as DefaultAvatar[],
    })

    const avatarToImage = (avatar: DefaultAvatar) =>
      `${config.staticBase}${config.avatarBase}/${avatar}.png`

    const onSubmit = async () => {
      const isOwn = !props.custom

      // Custom Image URL
      if (props.custom && typeof state.file === 'string') {
        await userStore.update(props.user.id, { avatar: state.file }, isOwn)
      }
      // Custom Image Upload
      else if (props.custom && state.file instanceof File) {
        await fileStore.create(state.file!)

        if (fileStore.error) {
          return snackbar.error(fileStore.error.message)
        }

        await userStore.update(
          props.user.id,
          { avatar: fileStore.file!.root },
          isOwn
        )
      }
      // Default Avatar Selected
      else {
        await userStore.update(
          props.user.id,
          { avatar: state.avatars[state.selected] },
          isOwn
        )
      }

      if (userStore.error) {
        return snackbar.error(userStore.error.message)
      }

      emit('update:avatar')

      state.dialog = false
    }

    return {
      ...toRefs(state),
      isLoading: computed(() => userStore.isLoading),
      avatarToImage,
      onSubmit,
    }
  },
})
</script>

<style lang="scss" scoped>
.active {
  display: flex;
  height: 100%;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 0 3px #000;
  border: 5px solid #fff;
  justify-content: center;
  align-items: center;
  z-index: 5;
}
</style>

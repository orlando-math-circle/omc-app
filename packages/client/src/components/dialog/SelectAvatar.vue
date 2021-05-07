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
        <template v-if="upload">
          <file-upload v-model="file" outlined label="Upload Avatar" />

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

export default defineComponent({
  props: {
    upload: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { $accessor: store, $config: config, $snack: snack } = useContext()

    const state = reactive({
      dialog: false,
      selected: 0,
      file: null as File | null,
      avatars: [...Array(10).keys()].map((k) =>
        k.toString()
      ) as DefaultAvatar[],
    })

    const isLoading = computed(() => store.users.isLoading)

    const avatarToImage = (avatar: DefaultAvatar) =>
      `${config.staticBase}${config.avatarBase}/${avatar}.png`

    const onSubmit = async () => {
      if (props.upload && state.file) {
        const url = (await store.files.filesToURL(state.file)) as string

        if (store.files.isErrored) {
          return snack(store.files.error!.message)
        }

        await store.users.update({
          id: props.user.id,
          updateUserDto: {
            avatar: url,
          },
        })
      } else {
        await store.users.updateOwn({
          id: store.auth.user!.id,
          updateOwnUserDto: {
            avatar: state.avatars[state.selected],
          },
        })
      }

      emit('update:avatar')

      state.dialog = false
    }

    return {
      ...toRefs(state),
      isLoading,
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

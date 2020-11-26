<template>
  <v-dialog v-model="dialog" max-width="440px">
    <template #activator="{ on, attrs }">
      <slot v-bind="{ on, attrs }"></slot>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Select Avatar</v-toolbar-title>

        <v-spacer></v-spacer>

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
              sm="4"
            >
              <v-item v-slot="{ active, toggle }">
                <v-card
                  class="d-flex align-center"
                  height="100"
                  width="100"
                  @click="toggle"
                >
                  <v-img :src="avatarToImage(avatar)">
                    <v-scroll-y-transition>
                      <div v-if="active" class="flex-grow-1 text-center">
                        Selected
                      </div>
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
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { DefaultAvatar } from '../../../backend/src/user/enums/default-avatar.enum'
import { User } from '../../../backend/src/user/user.entity'

@Component
export default class DialogSelectAvatar extends Vue {
  @Prop({ default: false }) upload!: boolean
  @Prop({ required: true }) user!: User

  dialog = false
  selected = 0
  file: File | null = null
  avatars = [...Array(10).keys()].map((key) =>
    key.toString()
  ) as DefaultAvatar[]

  get isLoading() {
    return this.$accessor.users.isLoading
  }

  avatarToImage(avatar: DefaultAvatar) {
    return `${this.$config.staticBase}${this.$config.avatarBase}/${avatar}.png`
  }

  async onSubmit() {
    if (this.upload && this.file) {
      const url = (await this.$accessor.files.filesToURL(this.file)) as string

      if (this.$accessor.files.error) {
        console.error(this.$accessor.files.error)
      }

      await this.$accessor.users.update({
        id: this.user.id,
        updateUserDto: {
          avatar: url,
        },
      })
    } else {
      await this.$accessor.users.updateOwn({
        id: this.$accessor.auth.user!.id,
        updateOwnUserDto: {
          avatar: this.avatars[this.selected],
        },
      })
    }

    this.$emit('update:avatar')

    this.dialog = false
  }
}
</script>

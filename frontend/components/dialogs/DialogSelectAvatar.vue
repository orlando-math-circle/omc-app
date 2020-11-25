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
import { Component, Vue } from 'nuxt-property-decorator'
import { DefaultAvatar } from '../../../backend/src/user/enums/default-avatar.enum'

@Component
export default class DialogSelectAvatar extends Vue {
  dialog = false
  selected = 0
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
    await this.$accessor.users.updateOwn({
      id: this.$accessor.auth.user!.id,
      updateOwnUserDto: {
        avatar: this.avatars[this.selected],
      },
    })

    await this.$accessor.auth.getMe()

    if (this.$route.path === '/account/settings') {
      await this.$accessor.auth.getAccount()
    }

    this.dialog = false
  }
}
</script>

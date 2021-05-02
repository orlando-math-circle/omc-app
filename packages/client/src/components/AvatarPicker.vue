<template>
  <v-sheet
    class="avatar--bg d-flex align-center justify-center"
    width="120px"
    height="120px"
  >
    <v-avatar size="110px">
      <v-img :src="url" />
    </v-avatar>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class AvatarPicker extends Vue {
  @Prop() url!: string
}
</script>

<style lang="scss">
.avatar {
  margin: 4px;

  &--bg {
    border-radius: 50% !important;
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 1;
  }

  &--offset {
    margin-top: 40px;
  }
}
</style>

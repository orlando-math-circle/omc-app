<template>
  <v-sheet
    class="avatar--bg d-flex align-center justify-center"
    width="130px"
    height="130px"
  >
    <v-avatar size="120px">
      <v-img :src="url"> </v-img>
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
    top: -40px;
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

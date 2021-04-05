<template>
  <v-app>
    <v-main class="wave-top">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'landing',
  // middleware: 'guest',
})
export default class LandingLayout extends Vue {}
</script>

<style lang="scss" scoped>
@import '~assets/styles/global.scss';

.page-enter-active,
.page-leave-active {
  transition-property: opacity;
  transition-timing-function: ease-in-out;
  transition-duration: 250ms;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}

.wave-top {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 50vw;
    background-size: cover;
    background-image: url('~assets/images/welcome-wave.svg');
    overflow: visible;
  }
}
</style>

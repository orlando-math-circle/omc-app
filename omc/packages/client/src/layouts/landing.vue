<template>
  <v-app>
    <v-main class="wave-top">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'Landing',
})
</script>

<style lang="scss" scoped>
@import '~/assets/styles/global.scss';

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

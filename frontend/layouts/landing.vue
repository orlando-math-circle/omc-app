<template>
  <v-app>
    <v-main>
      <div class="wave-top">
        <nuxt />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'landing',
})
export default class Landing extends Vue {}
</script>

<style lang="scss" scoped>
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
  position: relative;
  height: 100%;
  z-index: 0;

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
    z-index: -1;
  }
}
</style>

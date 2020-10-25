<template>
  <v-container fluid fill-height>
    <v-row justify="center">
      <v-col cols="12">
        <v-row>
          <v-col align="center">
            <v-img class="logo" :src="logo"></v-img>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-5">
            <div class="wave"></div>
            <v-btn block color="primary" to="/login" class="mb-4">
              Log in
            </v-btn>
            <v-btn block outlined to="/register"> Sign up </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  layout: 'landing',
  middleware: 'guest',
  head: {
    title: 'Welcome',
  },
})
export default class IndexPage extends Vue {
  get logo() {
    return this.$vuetify.theme.dark
      ? require('@/assets/images/logo_white.png')
      : require('@/assets/images/logo_dark.png')
  }
}
</script>

<style lang="scss" scoped>
.logo {
  height: 100%;
  max-width: 208px;
  max-height: 208px;
  margin: 30% 0 50% 0;
}

@keyframes wave {
  0% {
    transform: scale(1, 0);
  }
  100% {
    transform: scale(1, 2);
  }
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  height: 70vw;
  transform: scaleY(-1);
  background-size: cover;
  background-image: url('~assets/images/welcome-wave.svg');
}
</style>

<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-img
          v-if="$vuetify.theme.isDark"
          class="logo"
          :src="require(`@/assets/images/logo_dark.png`)"
        />
        <v-img
          v-else
          class="logo"
          :src="require(`@/assets/images/logo_white.png`)"
        />
      </v-col>
    </v-row>

    <v-row align="stretch" justify="end">
      <v-col justify="end">
        <div class="wave"></div>
        <v-btn block color="secondary" to="/login" class="mb-4"> Log in </v-btn>
        <v-btn block outlined to="/register"> Sign up </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'landing',
  middleware: 'auth',
  auth: 'guest',
}
</script>

<style lang="scss" scoped>
.logo {
  height: 100%;
  max-width: 208px;
  max-height: 208px;
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

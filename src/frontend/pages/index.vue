<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <logo />
        <v-card-title class="headline">
          Orlando Math Circle
        </v-card-title>
        <v-card-text>
          <p>Hello OMC!</p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import VuetifyLogo from "~/components/VuetifyLogo.vue"

export default {
  components: {
    VuetifyLogo
  }
}
</script>

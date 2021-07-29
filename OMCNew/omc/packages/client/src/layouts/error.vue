<template>
  <v-card>
    <v-card-title>
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
    </v-card-title>

    <v-card-text>
      <NuxtLink to="/"> Home page </NuxtLink>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const title = useMeta()

    const errors = {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }

    title.value =
      props.error.statusCode === 404 ? errors.pageNotFound : errors.otherError

    return {
      ...errors,
    }
  },
  head: {},
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>

<template>
  <div ref="animator" :class="classes" @click="animate">
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on" v-text="text"></span>
      </template>

      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@nuxtjs/composition-api'
import { useSnackbar } from '@/composables/useSnackbar'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const snackbar = useSnackbar()

    const state = reactive({
      animating: false,
      tooltip: 'Copy',
    })

    const animate = () => {
      state.animating = true
      state.tooltip = 'Copied!'

      snackbar.show('Copied to Clipboard!')

      setTimeout(() => (state.animating = false), 500)
      setTimeout(() => (state.tooltip = 'Copy'), 2000)

      if (!navigator || !navigator.clipboard) {
        console.warn('Unable to invoke clipboard')
      } else {
        navigator.clipboard.writeText(props.text)
      }
    }

    const classes = computed(() => ({
      'font-weight-bold': true,
      animate__faster: true,
      animate__animated: true,
      copylabel: true,
      animate__heartBeat: state.animating,
    }))

    return { classes, animate }
  },
})
</script>

<style lang="scss" scoped>
.copylabel {
  cursor: pointer;
  display: inline-block;
  border-bottom: 1px dashed;
}
</style>

<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="expands ? $vuetify.breakpoint.mobile : false"
    :max-width="width"
    persistent
    rounded=""
    @click:outside="handler"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn v-bind="attrs" color="secondary" v-on="on">Create</v-btn>
      </slot>
    </template>

    <v-card
      :style="{ borderRadius: $vuetify.breakpoint.mobile ? '0px' : 'inherit' }"
      @mousedown="setMouseDown"
    >
      <v-toolbar flat>
        <v-toolbar-title>
          <slot name="title"></slot>
        </v-toolbar-title>
        <v-btn small absolute right fab icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-subtitle v-if="$slots.footer">
        <slot name="subtitle"></slot>
      </v-card-subtitle>

      <slot name="image"></slot>

      <v-form-validated ref="form" v-slot="data" @submit:form="submit">
        <slot v-bind="{ ...data, closing }"></slot>
      </v-form-validated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'
import VFormValidated from '~/components/inputs/VFormValidated.vue'

export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 570,
    },
    expands: {
      type: Boolean,
      default: true,
    },
    resetValidation: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const form = ref<InstanceType<typeof VFormValidated>>()
    const state = reactive({
      dialog: false,
      closing: false,
      downInner: false,
    })

    watch(
      () => state.dialog,
      () => {
        if (state.dialog === false && props.resetValidation) {
          form.value!.reset()
        }

        if (state.dialog) {
          emit('dialog:open')
        } else {
          emit('dialog:close')
        }

        emit('dialog:state', state.dialog)
      }
    )

    const close = (delay: number = 0) => {
      if (!delay) {
        return emit('dialog:state', (state.dialog = false))
      }

      state.closing = true
      setTimeout(() => emit('dialog:state', (state.dialog = false)), delay)
    }

    const submit = () => emit('submit:form')

    watch(
      () => state.dialog,
      () => (state.downInner = false)
    )

    const setMouseDown = () => (state.downInner = true)

    const handler = () => {
      if (state.downInner === false) {
        state.dialog = false
      }

      state.downInner = true
    }

    return {
      ...toRefs(state),
      form,
      close,
      submit,
      setMouseDown,
      handler,
    }
  },
})
</script>

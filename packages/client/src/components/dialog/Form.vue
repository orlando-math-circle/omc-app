<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="expands ? $vuetify.breakpoint.mobile : false"
    :max-width="width"
    persistent
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
      <v-toolbar :flat="flat">
        <v-toolbar-title>
          <slot name="title" />
        </v-toolbar-title>

        <v-btn small absolute right fab icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-subtitle v-if="$slots.footer">
        <slot name="subtitle" />
      </v-card-subtitle>

      <slot name="image" />

      <VFormValidated ref="formRef" v-slot="data" @form:submit="submit">
        <slot v-bind="{ ...data, closing }" />

        <v-card-text>
          <v-row>
            <slot name="form" v-bind="{ ...data, closing }" />
          </v-row>
        </v-card-text>

        <slot name="actions" v-bind="{ ...data, closing }" />
      </VFormValidated>
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
import VFormValidated from '@/components/inputs/VFormValidated.vue'

export type FormComponent = InstanceType<typeof VFormValidated>

export default defineComponent({
  props: {
    width: {
      type: [Number, String],
      default: 570,
    },
    expands: {
      type: Boolean,
      default: true,
    },
    flat: {
      type: Boolean,
      default: true,
    },
    resetValidation: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const formRef = ref<FormComponent>()
    const state = reactive({
      dialog: false,
      closing: false,
      downInner: false,
    })

    watch(
      () => state.dialog,
      () => {
        if (state.dialog === false && props.resetValidation) {
          formRef.value!.resetValidation()
        }

        if (state.dialog) {
          emit('dialog:open')
        } else {
          emit('dialog:close')
        }

        emit('dialog:state', state.dialog)
      }
    )

    const open = () => (state.dialog = true)

    const close = (delay: number = 0) => {
      if (!delay) {
        return emit('dialog:state', (state.dialog = false))
      }

      state.closing = true
      setTimeout(() => emit('dialog:state', (state.dialog = false)), delay)
    }

    const submit = () => emit('form:submit')

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
      formRef,
      open,
      close,
      submit,
      setMouseDown,
      handler,
    }
  },
})
</script>

<template>
  <v-dialog v-model="dialog" v-bind="dialogAttrs">
    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <v-card v-bind="cardAttrs">
      <v-toolbar :flat="flat">
        <v-toolbar-title>
          <slot name="title" />
        </v-toolbar-title>

        <v-btn small absolute right fab icon class="mr-0" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <VFormValidated
        ref="formRef"
        v-slot="data"
        @form:submit="$emit('form:submit')"
      >
        <slot v-bind="{ ...data, closing }" />

        <v-card-text v-if="$scopedSlots.form">
          <v-row>
            <slot name="form" v-bind="{ ...data, closing }" />
          </v-row>
        </v-card-text>

        <v-card-actions v-if="$scopedSlots.actions">
          <slot name="actions" v-bind="{ ...data, closing }" />
        </v-card-actions>
      </VFormValidated>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  useContext,
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
      default: false,
    },
    flat: {
      type: Boolean,
      default: true,
    },
    resetOnClose: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const formRef = ref<FormComponent>()

    const { $vuetify } = useContext()

    const state = reactive({
      dialog: false,
      closing: false,
      downInner: false,
    })

    const dialogAttrs = computed(() => ({
      fullscreen: (props.expands && $vuetify.breakpoint.mobile) || false,
      maxWidth: props.width,
    }))

    const cardAttrs = computed(() => ({
      style: { borderRadius: $vuetify.breakpoint.mobile ? '0px' : 'inherit ' },
    }))

    watch(
      () => state.dialog,
      () => {
        if (state.dialog === false && props.resetOnClose) {
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

    const close = (delay = 0) => {
      if (!delay) {
        emit('dialog:state', false)
        emit('dialog:close')
        state.dialog = false
        state.closing = false

        return
      }

      state.closing = true
      setTimeout(() => close(), delay)
    }

    const resetValidation = () => formRef.value!.resetValidation()

    return {
      ...toRefs(state),
      formRef,
      open,
      close,
      dialogAttrs,
      cardAttrs,
      resetValidation,
    }
  },
})
</script>

<template>
  <v-dialog v-model="dialog" v-bind="dialogAttrs">
    <template #activator="activator">
      <slot name="activator" v-bind="activator" />
    </template>

    <v-card v-bind="cardAttrs">
      <v-toolbar flat>
        <v-toolbar-title>
          <slot name="title" />
        </v-toolbar-title>

        <v-btn small absolute fab right icon class="mr-0" @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-subtitle v-if="$slots.subtitle">
        <slot name="subtitle" />
      </v-card-subtitle>

      <slot name="image" />

      <VFormValidated
        ref="formRef"
        v-slot="form"
        @form:submit="$emit('form:submit')"
      >
        <slot v-bind="form" />

        <v-card-text>
          <v-row>
            <slot name="form" v-bind="form" />
          </v-row>
        </v-card-text>

        <v-card-actions>
          <slot name="actions" v-bind="{ ...form, closing, close }" />
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
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'
import { useTemplateRef } from '@/composables'
import VFormValidated from '@/components/inputs/VFormValidated.vue'

type FormComponent = InstanceType<typeof VFormValidated>

export default defineComponent({
  props: {
    expands: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 570,
    },
  },
  setup(props, { emit }) {
    const { $vuetify } = useContext()

    const formRef = useTemplateRef<FormComponent>('formRef')

    const state = reactive({
      dialog: false,
      closing: false,
    })

    const dialogAttrs = computed(() => ({
      fullscreen: (props.expands && $vuetify.breakpoint.mobile) || false,
      maxWidth: props.width,
    }))

    const cardAttrs = computed(() => ({
      style: { borderRadius: $vuetify.breakpoint.mobile ? '0px' : 'inherit ' },
    }))

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

    const resetValidation = () => {
      formRef.value!.resetValidation()
    }

    return {
      ...toRefs(state),
      open,
      close,
      cardAttrs,
      dialogAttrs,
      resetValidation,
    }
  },
})
</script>

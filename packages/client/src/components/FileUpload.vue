<template>
  <div>
    <v-window v-model="window">
      <v-window-item value="upload">
        <v-row>
          <v-col>
            <v-file-input
              v-model="files"
              :disabled="window === 'url'"
              prepend-icon=""
              v-bind="attributes"
              hide-details="auto"
              show-size
            />
          </v-col>

          <v-col v-if="hasFile" cols="auto" class="align-self-center">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="openDialog">
                  <v-icon>mdi-crop</v-icon>
                </v-btn>
              </template>

              <span>Crop Image</span>
            </v-tooltip>
          </v-col>

          <v-col cols="auto" class="align-self-center">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="switchTo('url')">
                  <v-icon>mdi-link-variant</v-icon>
                </v-btn>
              </template>

              <span>Use Direct URL</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="url">
        <v-row>
          <v-col>
            <v-text-field
              v-model="url"
              label="Image URL"
              hide-details="auto"
              outlined
            />
          </v-col>

          <v-col cols="auto" class="align-self-center">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="switchTo('upload')"
                >
                  <v-icon>mdi-file-upload</v-icon>
                </v-btn>
              </template>

              <span>Use File Upload</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <v-dialog v-model="dialog" max-width="450">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Crop Image</v-toolbar-title>

          <v-spacer />

          <v-btn icon @click="cropper && cropper.rotate(-90)">
            <v-icon>mdi-rotate-left</v-icon>
          </v-btn>

          <v-btn icon @click="cropper && cropper.rotate(90)">
            <v-icon>mdi-rotate-right</v-icon>
          </v-btn>

          <v-select
            v-model="ratio"
            class="aspect-selector"
            :items="ratios"
            label="Ratio"
            hide-details
            outlined
            dense
          />
        </v-toolbar>

        <div class="cropper-wrapper">
          <image ref="cropperEl" :src="objectURL" />
        </div>

        <v-card-actions>
          <v-spacer />

          <v-btn text @click="closeDialog">Close</v-btn>
          <v-btn color="primary" @click="onCrop">Crop</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Cropper from 'cropperjs'
import { Uploads } from '@/types/uploads.interface'
import 'cropperjs/dist/cropper.css'
import {
  defineComponent,
  onBeforeMount,
  PropType,
  reactive,
  ref,
  watch,
  nextTick,
  computed,
  toRefs,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<Uploads>,
      default: null,
    },
    field: {
      type: String,
      default: 'file',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    initialMode: {
      type: String as PropType<'upload' | 'url'>,
      default: 'upload',
    },
  },
  setup(props, { emit, attrs }) {
    const cropperEl = ref<HTMLImageElement>()

    const state = reactive({
      dialog: false,
      url: '',
      window: props.initialMode,
      files: props.multiple ? [] : (null as Uploads),
      cropper: null as Cropper | null,
      objectURL: null as string | null,
      preview: null as string | null,
      ratio: null as number | null,
    })

    const ratios = [
      { text: '16:9', value: 16 / 9 },
      { text: '4:3', value: 4 / 3 },
      { text: '1:1', value: 1 },
      { text: '2:3', value: 2 / 3 },
      { text: 'Free', value: null },
    ]

    watch(
      () => state.files,
      (files: Uploads) => {
        if (state.window !== 'upload') return

        emit('input', files)
      }
    )

    watch(
      () => state.url,
      (url: string) => {
        if (state.window !== 'url') return

        emit('input', url)
      }
    )

    onBeforeMount(() => {
      if (typeof props.value === 'string') {
        state.url = props.value
      } else if (
        props.value instanceof File ||
        (Array.isArray(props.value) &&
          props.value.every((f) => f instanceof File))
      ) {
        state.files = props.value
      }
    })

    const openDialog = () => {
      if (!state.files) return

      state.dialog = true
      onDialogOpen()
    }

    const closeDialog = () => {
      state.dialog = false
      state.cropper!.destroy()
    }

    const onDialogOpen = () => {
      if (state.cropper) {
        state.cropper.destroy()
      }

      if (state.objectURL) {
        window.URL.revokeObjectURL(state.objectURL)
      }

      state.objectURL = window.URL.createObjectURL(state.files)
      nextTick(setup)
    }

    const onCrop = () => {
      state.cropper!.getCroppedCanvas().toBlob((blob) => {
        if (!blob) return

        state.files = new File([blob], (state.files as File).name)
      })

      closeDialog()
    }

    watch(
      () => state.ratio,
      (ratio) => state.cropper!.setAspectRatio(ratio!)
    )

    const setup = () => {
      state.cropper = new Cropper(cropperEl.value!, {
        // aspectRatio: 1,
        viewMode: 2,
      })
    }

    const switchTo = (type: 'upload' | 'url') => {
      state.window = type
    }

    const hasFile = computed(
      () =>
        state.files && !(Array.isArray(state.files) && state.files.length === 0)
    )

    const attributes = computed(() => ({
      ...attrs,
      ...(props.multiple && { multiple: true }),
    }))

    return {
      ...toRefs(state),
      cropperEl,
      onCrop,
      ratios,
      openDialog,
      switchTo,
      hasFile,
      attributes,
    }
  },
})
</script>

<style lang="scss" scoped>
.aspect-selector {
  width: 50px;
}

.cropper-wrapper {
  min-height: 200px;
  max-height: 300px;
  position: relative;
}

::v-deep .cropper-bg {
  background-repeat: repeat;
}
</style>

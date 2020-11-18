<template>
  <div>
    <v-window v-model="window">
      <v-window-item value="upload">
        <v-row>
          <v-col>
            <v-file-input
              v-model="files"
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
                <v-btn icon v-bind="attrs" v-on="on" @click="window = 'url'">
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
                <v-btn icon v-bind="attrs" v-on="on" @click="window = 'upload'">
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

          <v-btn icon @click="cropper.rotate(-90)">
            <v-icon>mdi-rotate-left</v-icon>
          </v-btn>

          <v-btn icon @click="cropper.rotate(90)">
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
          <img ref="cropper" :src="objectURL" />
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
import { Component, Prop, Ref, Vue, Watch } from 'nuxt-property-decorator'
import Cropper from 'cropperjs'
import { Uploads } from '~/interfaces/uploads.interface'
import 'cropperjs/dist/cropper.css'

@Component
export default class FileUpload extends Vue {
  @Prop() value?: string | File
  @Ref('cropper') readonly cropperEl!: HTMLImageElement
  @Prop({ default: 'file' }) field!: string
  @Prop({ default: false }) multiple!: boolean

  dialog = false
  url = ''
  window: 'upload' | 'url' = 'upload'
  files: Uploads = this.multiple ? [] : null
  cropper: Cropper | null = null
  objectURL: string | null = null
  preview: string | null = null
  ratio: string | null = null

  ratios = [
    { text: '16:9', value: 16 / 9 },
    { text: '4:3', value: 4 / 3 },
    { text: '1:1', value: 1 },
    { text: '2:3', value: 2 / 3 },
    { text: 'Free', value: null },
  ]

  beforeMount() {
    if (typeof this.value === 'string') {
      this.window = 'url'
    }
  }

  openDialog() {
    if (!this.files) return

    this.dialog = true
    this.onDialogOpen()
  }

  closeDialog() {
    this.dialog = false

    this.cropper!.destroy()
  }

  onDialogOpen() {
    if (this.cropper) {
      this.cropper.destroy()
    }

    if (this.objectURL) {
      window.URL.revokeObjectURL(this.objectURL)
    }

    this.objectURL = window.URL.createObjectURL(this.files)
    this.$nextTick(this.setup)
  }

  onCrop() {
    this.cropper!.getCroppedCanvas().toBlob((blob) => {
      if (!blob) return

      this.files = new File([blob], (this.files as File).name)
    })

    this.closeDialog()
  }

  @Watch('ratio')
  onChangeRatio(ratio: number) {
    this.cropper!.setAspectRatio(ratio)
  }

  setup() {
    this.cropper = new Cropper(this.cropperEl, {
      // aspectRatio: 1,
      viewMode: 2,
    })
  }

  get hasFile() {
    return this.files && !(Array.isArray(this.files) && this.files.length === 0)
  }

  get attributes() {
    return Object.assign(
      { ...this.$attrs },
      this.multiple && { multiple: true }
    )
  }

  @Watch('files')
  onFilesChange(files: Uploads) {
    this.$emit('input', files)
  }
}
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

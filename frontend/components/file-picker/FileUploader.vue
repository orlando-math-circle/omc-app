<template>
  <dropzone
    id="dropzone"
    ref="el"
    :options="options"
    @vdropzone-file-added="onFileAdded"
    @vdropzone-removed-file="onRemove"
  >
    <div class="dz-message" data-dz-message>
      Drag and drop a file to upload or click here.
    </div>
  </dropzone>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Dropzone from 'nuxt-dropzone'
import { DropzoneFile } from 'dropzone'
import 'nuxt-dropzone/dropzone.css'

@Component({
  components: {
    Dropzone,
  },
})
export default class FileUploader extends Vue {
  @Prop({ required: true }) endpoint!: string

  complete(files: any) {
    console.log(files)
  }

  get options() {
    return {
      url: this.url,
      headers: {
        Authorization: `Bearer ${this.$accessor.auth.token}`,
      },
      addRemoveLinks: true,
    }
  }

  get url() {
    return `${process.env.AXIOS_BROWSER_BASE_URL}${this.endpoint}`
  }

  onFileAdded(file: DropzoneFile) {
    console.log('File Added', file)
  }

  async onRemove(file: DropzoneFile) {
    if (!file?.xhr?.response) return

    const upload = JSON.parse(file.xhr.response)

    console.log(upload)

    // Check if this is called when all files are attempted to be removed.
    const id: number = Array.isArray(upload) ? upload[0].id : upload.id

    if (id) {
      await this.$accessor.files.delete(id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.vue-dropzone {
  font-family: inherit;
}

#dropzone {
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.24);
  border-radius: $border-radius-root;
}

.theme--dark {
  #dropzone {
    background-color: rgb(0, 0, 0, 0.2);
  }
}

.theme--light {
  #dropzone {
    border-color: rgba(0, 0, 0, 0.38);

    &:hover {
      border-color: rgba(0, 0, 0, 0.42);
    }
  }
}
</style>

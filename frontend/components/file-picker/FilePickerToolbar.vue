<template>
  <v-toolbar flat dense>
    <v-toolbar-items>
      <v-btn text :input-value="path === '/'" @click="changePath('/')">
        <v-icon class="mr-2">{{ storageObject.icon }}</v-icon>
        {{ storageObject.name }}
      </v-btn>

      <template v-for="(segment, index) in pathSegments">
        <v-icon :key="index + '-icon'">mdi-chevron-right</v-icon>
        <v-btn
          :key="index + '-btn'"
          text
          :input-value="index === pathSegments.length - 1"
          @click="changePath(segment.path)"
          >{{ segment.name }}</v-btn
        >
      </template>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-tooltip v-if="pathSegments.length > 0" bottom>
      <template #activator="{ on }">
        <v-btn icon @click="goUp" v-on="on">
          <v-icon>mdi-arrow-up-bold-outline</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class FilesPage extends Vue {
  @Prop() path!: string

  get segments() {
    return this.path.split('/')
  }
}
</script>

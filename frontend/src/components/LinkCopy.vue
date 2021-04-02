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
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class LinkCopy extends Vue {
  @Prop() text!: string

  animating = false
  tooltip = 'Copy'

  animate() {
    this.animating = true
    this.tooltip = 'Copied!'

    this.$accessor.snackbar.show({
      text: 'Copied to clipboard!',
      timeout: 4000,
    })

    setTimeout(() => (this.animating = false), 500)
    setTimeout(() => (this.tooltip = 'Copy'), 2000)

    if (!navigator || !navigator.clipboard) {
      console.warn('Unable to invoke clipboard')
    } else {
      navigator.clipboard.writeText(this.text)
    }
  }

  get classes() {
    return {
      'font-weight-bold': true,
      animate__faster: true,
      animate__animated: true,
      copylabel: true,
      animate__heartBeat: this.animating,
    }
  }
}
</script>

<style lang="scss" scoped>
.copylabel {
  cursor: pointer;
  display: inline-block;
  border-bottom: 1px dashed;
}
</style>

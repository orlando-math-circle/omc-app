<template>
  <div class="codeblock">
    <pre>{{ JSON.stringify(code, null, 2) }}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

/**
 * Simplistic codeblock with no syntax highlighting.
 * If more advanced features are desired, see the PrismJS library.
 */

@Component
export default class Codeblock extends Vue {
  @Prop() code: any
}
</script>

<style lang="scss" scoped>
.codeblock {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  margin: 0.5em 0;
  padding: 1.25em 1em;
}
</style>

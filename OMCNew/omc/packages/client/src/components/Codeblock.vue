<template>
  <div class="codeblock">
    <pre>{{ JSON.stringify(code, null, 2) }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

/**
 * Simplistic codeblock with no syntax highlighting.
 * If more advanced features are desired, see the PrismJS library.
 */

export default defineComponent({
  props: {
    code: {
      type: [String, Number, Boolean, Object],
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.codeblock {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  margin: 0.5em 0;
  padding: 1.25em 1em;
}
</style>

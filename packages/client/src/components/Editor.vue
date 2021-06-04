<template>
  <div v-if="editor">
    <v-divider />

    <div class="pa-1">
      <v-btn
        icon
        tile
        :input-value="editor.isActive('bold')"
        @click="editor && editor.chain().focus().toggleBold().run()"
      >
        <v-icon>mdi-format-bold</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        :input-value="editor.isActive('italic')"
        @click="editor && editor.chain().focus().toggleItalic().run()"
      >
        <v-icon>mdi-format-italic</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('strike')"
        @click="editor && editor.chain().focus().toggleStrike().run()"
      >
        <v-icon>mdi-format-strikethrough</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('underline')"
        @click="editor && editor.chain().focus().toggleUnderline().run()"
      >
        <v-icon>mdi-format-underline</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('paragraph')"
        @click="editor && editor.chain().focus().setParagraph().run()"
      >
        <v-icon>mdi-format-paragraph</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('heading', { level: 1 })"
        @click="
          editor && editor.chain().focus().toggleHeading({ level: 1 }).run()
        "
      >
        <v-icon>mdi-format-header-1</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('heading', { level: 2 })"
        @click="
          editor && editor.chain().focus().toggleHeading({ level: 2 }).run()
        "
      >
        <v-icon>mdi-format-header-2</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('heading', { level: 3 })"
        @click="
          editor && editor.chain().focus().toggleHeading({ level: 3 }).run()
        "
      >
        <v-icon>mdi-format-header-3</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('bulletList')"
        @click="editor && editor.chain().focus().toggleBulletList().run()"
      >
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('orderedList')"
        @click="editor && editor.chain().focus().toggleOrderedList().run()"
      >
        <v-icon>mdi-format-list-numbered</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('blockquote')"
        @click="editor && editor.chain().focus().toggleBlockquote().run()"
      >
        <v-icon>mdi-format-quote-close</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        :input-value="editor.isActive('code')"
        @click="editor && editor.chain().focus().toggleCode().run()"
      >
        <v-icon>mdi-code-tags</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        @click="editor && editor.chain().focus().setHorizontalRule().run()"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        @click="editor && editor.chain().focus().undo().run()"
      >
        <v-icon>mdi-undo</v-icon>
      </v-btn>

      <v-btn
        icon
        tile
        active
        @click="editor && editor.chain().focus().redo().run()"
      >
        <v-icon>mdi-redo</v-icon>
      </v-btn>
    </div>

    <v-divider />

    <EditorContent class="editor pa-3 py-4" :editor="editor" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

export default defineComponent({
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const editor = ref<Editor>()

    watch(
      () => props.value,
      (value: string) => {
        const isSame = editor.value!.getHTML() === value

        if (isSame) return

        editor.value!.commands.setContent(props.value, false)
      }
    )

    onMounted(() => {
      editor.value = new Editor({
        extensions: [StarterKit, Underline],
        onUpdate: () => {
          emit('input', editor.value!.getHTML())
        },
      })
    })

    onBeforeUnmount(() => editor.value!.destroy())

    return { editor }
  },
})
</script>

<style lang="scss" scoped>
.editor {
  ::v-deep blockquote {
    border-left: 3px solid rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.8);
    padding-left: 0.8rem;
    font-style: italic;
  }

  ::v-deep .ProseMirror {
    outline: none;
  }
}
</style>

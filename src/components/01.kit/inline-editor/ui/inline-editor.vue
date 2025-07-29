<script setup lang="ts">
import { marked } from 'marked'

type EditorMode = 'text' | 'markdown'
type InputType = 'input' | 'textarea'

interface Props {
  tag?: string
  inputType?: InputType
  mode?: EditorMode
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  inputType: 'textarea',
  mode: 'text',
  placeholder: 'Введите значение...',
  class: '',
})

const model = defineModel<string>({ required: true })

const isEditing = ref(false)
const editorWrapperRef = ref<HTMLElement | null>(null)

const renderedMarkdown = computed(() => {
  if (props.mode === 'markdown') {
    return marked.parse(model.value || '', { gfm: true, breaks: true })
  }

  return ''
})

// --- Управление состоянием редактирования ---
async function startEditing() {
  isEditing.value = true
  await nextTick()
  const editorEl = editorWrapperRef.value?.querySelector('textarea, input') as HTMLElement
  if (editorEl) {
    editorEl.focus()
  }
}

function stopEditing() {
  isEditing.value = false
}

onClickOutside(editorWrapperRef, stopEditing)
</script>

<template>
  <div ref="editorWrapperRef" class="inline-editor-wrapper" :class="props.class">
    <template v-if="isEditing">
      <div v-if="mode === 'markdown'" class="markdown-editor">
        <div class="markdown-render" aria-hidden="true" v-html="renderedMarkdown" />
        <textarea
          v-model="model"
          class="markdown-input"
          :placeholder="placeholder"
          @keydown.esc.prevent="stopEditing"
        />
      </div>
      <component
        :is="props.inputType === 'textarea' ? 'textarea' : 'input'"
        v-else
        v-model="model"
        class="editor-input"
        :placeholder="placeholder"
        @blur="stopEditing"
        @keydown.esc="stopEditing"
        @keydown.enter.prevent="props.inputType === 'input' ? stopEditing() : null"
      />
    </template>

    <template v-else>
      <component
        :is="tag"
        v-if="mode === 'markdown'"
        class="display-text markdown-render"
        :class="{ 'is-empty': !model }"
        @click="startEditing"
      />
      <!-- Отображение обычного текста -->
      <component
        :is="tag"
        v-else
        class="display-text"
        :class="{ 'is-empty': !model }"
        @click="startEditing"
      >
        {{ model || placeholder }}
      </component>
    </template>
  </div>
</template>

<style scoped lang="scss">
.inline-editor-wrapper {
  position: relative;
  width: 100%;
  font: inherit;
  color: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  font-weight: inherit;
}

.display-text {
  cursor: pointer;
  width: 100%;
  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
  }

  &.is-empty {
    opacity: 0.6;
    font-style: italic;
  }
}

.editor-input {
  font: inherit;
  color: inherit;
  width: 100%;
  padding: 2px 4px;
  margin: -2px -4px;
  border: none;
  background-color: var(--bg-hover-color);
  outline: none;
  resize: none;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px var(--border-primary-color);
}

.markdown-editor {
  position: relative;
}

%markdown-typography {
  font-family: inherit;
  font-size: inherit;
  line-height: 1.6;
  font-weight: inherit;
  color: inherit;
  padding: 2px 4px;
  margin: 0;
  border: 1px solid transparent;
  white-space: pre-wrap;
  word-break: break-word;
}

.markdown-render {
  @extend %markdown-typography;
  :deep() {
    p,
    ul,
    ol,
    blockquote {
      margin-top: 0;
      margin-bottom: 0.5em;
      &:last-child {
        margin-bottom: 0;
      }
    }
    h1,
    h2,
    h3 {
      font-size: 1.1em;
      font-weight: 600;
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }
    a {
      color: var(--fg-accent-color);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    code {
      background-color: var(--bg-hover-color);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9em;
    }
    blockquote {
      border-left: 3px solid var(--border-primary-color);
      padding-left: 1em;
      margin-left: 0;
      color: var(--fg-secondary-color);
    }
  }
}

.markdown-input {
  @extend %markdown-typography;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  resize: none;
  outline: none;
  background-color: transparent;
  color: transparent;
  caret-color: var(--fg-primary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 4px;
}
</style>

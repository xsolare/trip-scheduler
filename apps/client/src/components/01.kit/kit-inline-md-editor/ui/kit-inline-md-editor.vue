<script setup lang="ts">
import type { CrepeFeature } from '@milkdown/crepe'
import { Crepe } from '@milkdown/crepe'
import { editorViewOptionsCtx } from '@milkdown/kit/core'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { Milkdown, useEditor } from '@milkdown/vue'
import '@milkdown/crepe/theme/common/style.css'

interface Props {
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  features?: Partial<Record<CrepeFeature, boolean>>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'markdownUpdated', value: string): void
  (e: 'updated'): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()
const markdown = defineModel<string>({ required: true })

if (markdown.value === undefined) {
  markdown.value = ``
}

useEditor((root) => {
  const crepe = new Crepe({
    root,
    defaultValue: markdown.value,
    featureConfigs: {
      [Crepe.Feature.Placeholder]: {
        text: props.placeholder || 'Начните вводить текст...',
      },
    },
    features: {
      ...props.features,
      [Crepe.Feature.Latex]: false,
    },
  })

  crepe.editor
    .config((ctx) => {
      ctx.update(editorViewOptionsCtx, prev => ({
        ...prev,
        editable: () => !props.disabled && !props.readonly,
      }))

      const listenerValue = ctx.get(listenerCtx)
      listenerValue.markdownUpdated((_, md) => {
        markdown.value = md
      })
    })
    .use(listener)

  crepe.on((crepeListener) => {
    // crepeListener.markdownUpdated((md) => {
    //   console.log('Markdown updated:', md)
    // })

    crepeListener.updated(() => {
      emit('updated')
    })

    crepeListener.focus(() => {
      emit('focus')
    })

    crepeListener.blur(() => {
      emit('blur')
    })
  })

  return crepe
})
</script>

<template>
  <div
    :class="{
      'milkdown-disabled': disabled,
      'has-content': !!markdown }"
  >
    <Milkdown />
  </div>
</template>

<style lang="scss" scoped>
.milkdown-disabled {
  opacity: 0.7;
  pointer-events: none;
}

.has-content :deep(.crepe-placeholder) {
  opacity: 0;
}

:deep() {
  .milkdown {
    > div {
      padding: 8px;
    }
    em {
      color: var(--fg-highlight-color);
    }
    code {
      color: var(--fg-secondary-color);
      background: var(--bg-tertiary-color);
    }
    p {
      margin: 0;
      padding: 0;
    }
    strong {
      color: var(--fg-highlight-color);
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    em,
    code {
      font-family: 'Rubik';
    }
    blockquote {
      padding-left: 16px;
    }
    .list-item {
      gap: 2px;
    }
    .label-wrapper {
      height: auto !important;
    }
    .ordered,
    .bullet {
      padding: 0 !important;
      height: auto !important;
      font-weight: 500;
      color: var(--fg-tertiary-color);

      > svg {
        fill: var(--fg-secondary-color) !important;
      }
    }
    .milkdown-code-block {
      padding: 0;

      .cm-line {
        color: var(--fg-secondary-color);
      }
    }
    .ProseMirror p:last-child > .ProseMirror-trailingBreak {
      display: none;
    }
  }
  .milkdown-block-handle {
    z-index: 100;
    padding: 4px !important;

    .operation-item {
      background-color: var(--bg-secondary-color);
      border: 1px solid var(--border-secondary-color);
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      &:last-of-type {
        display: none !important;
      }
    }
  }
}
</style>

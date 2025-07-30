<script setup lang="ts">
import type { CrepeFeature } from '@milkdown/crepe'
import { Crepe } from '@milkdown/crepe'
import { editorViewOptionsCtx } from '@milkdown/kit/core'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { Milkdown, useEditor } from '@milkdown/vue'
import '@milkdown/crepe/theme/common/style.css'

interface Props {
  disabled?: boolean
  placeholder?: string
  features?: Partial<Record<CrepeFeature, boolean>>
}

const props = defineProps<Props>()
const markdown = defineModel<string>({ required: true })

const attributes = useAttrs()

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
    features: props.features,
  })

  crepe.editor
    .config((ctx) => {
      ctx.update(editorViewOptionsCtx, prev => ({
        ...prev,
        editable: () => !props.disabled,

      }))

      const listenerValue = ctx.get(listenerCtx)
      listenerValue.markdownUpdated((_, md) => {
        markdown.value = md
      })
    })
    .use(listener)

  crepe.on((crepeListener) => {
    crepeListener.markdownUpdated((md) => {
      // eslint-disable-next-line no-console
      console.log('Markdown updated:', md)
    })

    crepeListener.updated(() => {
      // eslint-disable-next-line no-console
      console.log('Document updated')
    })

    crepeListener.focus(() => {
      // eslint-disable-next-line no-console
      console.log('Editor focused')
    })

    crepeListener.blur(() => {
      // eslint-disable-next-line no-console
      console.log('Editor blurred')
    })
  })

  return crepe
})
</script>

<template>
  <div :class="{ 'milkdown-disabled': disabled }" :attributes>
    <Milkdown />
  </div>
</template>

<style lang="scss" scoped>
.milkdown-disabled {
  opacity: 0.7;
  pointer-events: none;
}

:deep() {
  .milkdown {
    > div {
      padding: 16px;
    }
  }
}
</style>

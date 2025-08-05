<script setup lang="ts">
import type { CrepeFeature } from '@milkdown/crepe'
import { MilkdownProvider } from '@milkdown/vue'
import { InlineEditor } from '~/components/01.kit/inline-editor'

interface Props {
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  features?: Partial<Record<CrepeFeature, boolean>>
}

// eslint-disable-next-line unused-imports/no-unused-vars
const props = defineProps<Props>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <MilkdownProvider>
      <InlineEditor
        v-model="model"
        :="props"
      />
    </MilkdownProvider>
  </div>
</template>

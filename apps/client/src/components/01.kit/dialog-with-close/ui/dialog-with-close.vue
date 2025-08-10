<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

interface Props {
  maxWidth?: number
  title?: string
}

const { maxWidth = 700, title } = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })

const maxWidthPx = computed(() => `${maxWidth}px`)
</script>

<template>
  <DialogRoot v-model:open="visible">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent
        class="dialog-content-wrapper"
        :style="{ maxWidth: maxWidthPx }"
        @pointer-down-outside="(event) => {
          const originalEvent = event.detail.originalEvent
          const target = originalEvent.target as HTMLElement
          if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight)
            event.preventDefault()
        }"
      >
        <div class="dialog-header">
          <DialogTitle class="dialog-title">
            {{ title }}
          </DialogTitle>
          <DialogClose as-child>
            <button class="close-button">
              <Icon icon="mdi:close" />
            </button>
          </DialogClose>
        </div>
        <div class="dialog-body">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss" scoped>
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  inset: 0;
  z-index: 1000;
  animation: overlay-show 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dialog-content-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg-primary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: 8px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 90vw;
  padding: 16px;
  animation: content-show 150ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:focus {
    outline: none;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--fg-primary-color);
}

.close-button {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--fg-secondary-color);
  border-radius: var(--r-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-accent-color);
  }
}

.dialog-body {
  flex-grow: 1;
  overflow-y: auto;
}

@keyframes overlay-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes content-show {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>

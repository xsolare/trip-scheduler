<script setup lang="ts" generic="T extends string | number">
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import { ref, watch } from 'vue'
import { KitViewSwitcher } from '~/components/01.kit/kit-view-switcher'

const props = defineProps<{
  items: ViewSwitcherItem<T>[]
}>()

const model = defineModel<T>({ required: true })

const transitionName = ref('slide-left')
const contentWrapperRef = ref<HTMLElement | null>(null)

watch(model, (newVal, oldVal) => {
  const newIndex = props.items.findIndex(item => item.id === newVal)
  const oldIndex = props.items.findIndex(item => item.id === oldVal)
  transitionName.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
})

function onBeforeLeave(el: Element) {
  if (contentWrapperRef.value) {
    const htmlEl = el as HTMLElement
    contentWrapperRef.value.style.height = `${htmlEl.offsetHeight}px`
  }
}

function onEnter(el: Element) {
  if (contentWrapperRef.value) {
    const htmlEl = el as HTMLElement
    requestAnimationFrame(() => {
      if (contentWrapperRef.value) {
        contentWrapperRef.value.style.height = `${htmlEl.offsetHeight}px`
      }
    })
  }
}

function onAfterEnter() {
  if (contentWrapperRef.value) {
    contentWrapperRef.value.style.height = 'auto'
  }
}
</script>

<template>
  <div class="kit-tabs">
    <KitViewSwitcher v-model="model" :items="items" full-width />

    <div ref="contentWrapperRef" class="kit-tabs-content-wrapper">
      <Transition
        :name="transitionName"
        @before-leave="onBeforeLeave"
        @enter="onEnter"
        @after-enter="onAfterEnter"
      >
        <div :key="model" class="kit-tabs-pane">
          <slot :name="model" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kit-tabs {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.kit-tabs-content-wrapper {
  position: relative;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  min-height: 50px;
}

.kit-tabs-pane {
  width: 100%;
}

/*
 * Стили для анимации свайпа
 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-left-leave-active,
.slide-right-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

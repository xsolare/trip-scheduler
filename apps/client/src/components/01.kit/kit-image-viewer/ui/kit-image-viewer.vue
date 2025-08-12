<script setup lang="ts">
import type { ImageViewerImage } from '../models/types'
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'

interface Props {
  visible: boolean
  images: ImageViewerImage[]
  currentIndex: number
  showCounter?: boolean
  enableThumbnails?: boolean
  closeOnOverlayClick?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:currentIndex', value: number): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  showCounter: true,
  enableThumbnails: false,
  closeOnOverlayClick: true,
})

const emit = defineEmits<Emits>()

const viewerContentRef = ref(null)
const imageRef = ref<HTMLImageElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const startDrag = reactive({ x: 0, y: 0 })

const MIN_SCALE = 1
const MAX_SCALE = 5
const SCALE_STEP = 0.3

const imageStyle = computed(() => ({
  cursor: scale.value > 1 ? (isDragging.value ? 'grabbing' : 'grab') : 'default',
  transform: `scale(${scale.value}) translate(${offsetX.value}px, ${offsetY.value}px)`,
  transition: isDragging.value ? 'none' : 'transform 0.2s ease-out',
}))

function resetZoom() {
  scale.value = MIN_SCALE
  offsetX.value = 0
  offsetY.value = 0
}

function constrainOffset() {
  if (!imageRef.value || !containerRef.value)
    return

  const imageRect = imageRef.value.getBoundingClientRect()
  const containerRect = containerRef.value.getBoundingClientRect()

  const scaledWidth = imageRect.width * scale.value
  const scaledHeight = imageRect.height * scale.value

  const maxOffsetX = Math.max(0, (scaledWidth - containerRect.width) / 2)
  const maxOffsetY = Math.max(0, (scaledHeight - containerRect.height) / 2)

  offsetX.value = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX.value))
  offsetY.value = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY.value))
}

watch(() => props.currentIndex, () => {
  resetZoom()
})

watch(() => props.visible, (isVisible) => {
  if (!isVisible) {
    resetZoom()
  }
})

watch(scale, () => {
  nextTick(() => {
    constrainOffset()
  })
})

function handleDblClick(event: MouseEvent) {
  event.preventDefault()

  if (scale.value > MIN_SCALE) {
    resetZoom()
  }
  else {
    // Увеличиваем с учетом позиции курсора
    const rect = imageRef.value?.getBoundingClientRect()
    if (!rect)
      return

    const clickX = event.clientX - rect.left - rect.width / 2
    const clickY = event.clientY - rect.top - rect.height / 2

    const newScale = 2
    scale.value = newScale

    // Центрируем увеличение на позиции клика
    offsetX.value = -clickX * (newScale - 1) / newScale
    offsetY.value = -clickY * (newScale - 1) / newScale
  }
}

function handleWheel(event: WheelEvent) {
  event.preventDefault()

  const imageEl = imageRef.value
  if (!imageEl)
    return

  const rect = imageEl.getBoundingClientRect()

  // Получаем позицию курсора относительно изображения
  const mouseX = event.clientX - rect.left - rect.width / 2
  const mouseY = event.clientY - rect.top - rect.height / 2

  const oldScale = scale.value
  const delta = event.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
  const newScale = Math.max(MIN_SCALE, Math.min(oldScale + delta, MAX_SCALE))

  if (newScale <= MIN_SCALE) {
    resetZoom()
    return
  }

  // Вычисляем новые смещения для зума в точку курсора
  const scaleRatio = newScale / oldScale

  offsetX.value = mouseX - (mouseX - offsetX.value) * scaleRatio
  offsetY.value = mouseY - (mouseY - offsetY.value) * scaleRatio

  scale.value = newScale
}

function handleMouseDown(event: MouseEvent) {
  if (scale.value <= MIN_SCALE)
    return

  event.preventDefault()
  isDragging.value = true
  startDrag.x = event.clientX - offsetX.value
  startDrag.y = event.clientY - offsetY.value

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp, { once: true })
  document.addEventListener('mouseleave', handleMouseUp, { once: true })
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value)
    return

  offsetX.value = event.clientX - startDrag.x
  offsetY.value = event.clientY - startDrag.y
}

function handleMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  constrainOffset()
}

// Предотвращаем контекстное меню на изображении
function handleContextMenu(event: MouseEvent) {
  event.preventDefault()
}

const currentImage = computed(() => props.images[props.currentIndex])
const hasMultipleImages = computed(() => props.images.length > 1)

function close() {
  emit('update:visible', false)
  emit('close')
}

function next() {
  if (!hasMultipleImages.value)
    return
  const newIndex = (props.currentIndex + 1) % props.images.length
  emit('update:currentIndex', newIndex)
}

function prev() {
  if (!hasMultipleImages.value)
    return
  const newIndex = (props.currentIndex - 1 + props.images.length) % props.images.length
  emit('update:currentIndex', newIndex)
}

function goToIndex(index: number) {
  if (index >= 0 && index < props.images.length) {
    emit('update:currentIndex', index)
  }
}

onClickOutside(viewerContentRef, () => {
  if (props.closeOnOverlayClick && props.visible && !isDragging.value && scale.value <= MIN_SCALE) {
    close()
  }
})

// Блокируем скролл страницы при открытом просмотрщике
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="faded">
      <div
        v-if="visible"
        class="image-viewer-overlay"
        @wheel.prevent="handleWheel"
      >
        <div ref="viewerContentRef" class="viewer-wrapper">
          <div class="viewer-header">
            <div v-if="showCounter && hasMultipleImages" class="viewer-counter">
              {{ currentIndex + 1 }} из {{ images.length }}
            </div>
            <button class="close-btn" @click="close">
              <Icon icon="mdi:close" />
            </button>
          </div>

          <div class="viewer-content">
            <button
              v-if="hasMultipleImages"
              class="nav-btn prev-btn"
              @click="prev"
            >
              <Icon icon="mdi:chevron-left" />
            </button>

            <div
              ref="containerRef"
              class="image-container"
            >
              <img
                v-if="currentImage"
                ref="imageRef"
                :src="currentImage.url"
                :alt="currentImage.alt || `Image ${currentIndex + 1}`"
                class="viewer-image"
                :style="imageStyle"
                @mousedown="handleMouseDown"
                @dblclick="handleDblClick"
                @contextmenu="handleContextMenu"
                @dragstart.prevent
              >
            </div>

            <button
              v-if="hasMultipleImages"
              class="nav-btn next-btn"
              @click="next"
            >
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>

          <div v-if="$slots.footer" class="viewer-footer">
            <slot name="footer" :image="currentImage" :index="currentIndex" />
          </div>

          <div v-if="enableThumbnails && hasMultipleImages" class="thumbnails-container">
            <div class="thumbnails-wrapper">
              <button
                v-for="(image, index) in images"
                :key="index"
                class="thumbnail"
                :class="{ active: index === currentIndex }"
                @click="goToIndex(index)"
              >
                <img :src="image.url" :alt="image.alt || `Thumbnail ${index + 1}`">
              </button>
            </div>
          </div>

          <!-- Индикатор масштаба -->
          <div v-if="scale > MIN_SCALE" class="scale-indicator">
            {{ Math.round(scale * 100) }}%
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.image-viewer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;
}

.viewer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 100%;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
}

.viewer-header {
  position: absolute;
  top: 20px;
  right: 20px;
  left: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.viewer-counter {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: var(--r-xl);
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  margin-left: auto;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: var(--r-full);
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.viewer-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90vw;
  max-height: 80vh;
  position: relative;
  height: 100%;
}

.viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--r-m);
  box-shadow: 0 20px 60px var(--bg-overlay-primary-color);
  background: var(--bg-overlay-primary-color);
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  pointer-events: auto;
  transform-origin: center;
}

.nav-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--r-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  transition: all 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

.viewer-footer {
  display: flex;
  justify-content: center;
  z-index: 5;
}

.thumbnails-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 80%;
}

.thumbnails-wrapper {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: var(--r-l);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.thumbnail {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: var(--r-s);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;

  &.active {
    border-color: white;
  }

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.scale-indicator {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: var(--r-m);
  font-size: 0.8rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  z-index: 10;
}

.faded-enter-active,
.faded-leave-active {
  transition: opacity 0.3s ease;
}

.faded-enter-from,
.faded-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .image-viewer-overlay {
    padding: 10px;
  }

  .viewer-header {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .image-container {
    max-width: 95vw;
    max-height: 75vh;
  }

  .nav-btn {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }

  .thumbnails-container {
    bottom: 10px;
    max-width: 90%;
  }

  .thumbnail {
    width: 50px;
    height: 50px;
  }

  .scale-indicator {
    top: 60px;
  }
}
</style>

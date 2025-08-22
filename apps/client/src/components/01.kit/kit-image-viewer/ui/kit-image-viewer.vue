<script setup lang="ts">
import type { IImageViewerImageMeta, ImageViewerImage, TouchPoint, ViewerBounds, ViewerTransform } from '../models/types'
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import ImageMetadataPanel from './kit-image-metadata-panel.vue'

interface Props {
  visible: boolean
  images: ImageViewerImage[]
  currentIndex: number
  showCounter?: boolean
  enableThumbnails?: boolean
  closeOnOverlayClick?: boolean
  maxZoom?: number
  minZoom?: number
  zoomStep?: number
  enableTouch?: boolean
  animationDuration?: number
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:currentIndex', value: number): void
  (e: 'close'): void
  (e: 'imageLoad', image: ImageViewerImage): void
  (e: 'imageError', error: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  showCounter: true,
  enableThumbnails: false,
  closeOnOverlayClick: true,
  maxZoom: 4,
  minZoom: 1,
  zoomStep: 0.5,
  enableTouch: true,
  animationDuration: 300,
})

const emit = defineEmits<Emits>()

// --- Состояние компонента ---
const viewerContentRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const transform = reactive<ViewerTransform>({ scale: 1, x: 0, y: 0 })
const isDragging = ref(false)
const isAnimating = ref(false)
const wheeling = ref(false)
let wheelTimeoutId: number | undefined
const dragStart = reactive<TouchPoint>({ x: 0, y: 0 })
const transformStart = reactive<ViewerTransform>({ scale: 1, x: 0, y: 0 })
const touches = ref<TouchPoint[]>([])
const initialDistance = ref(0)
const initialScale = ref(1)
const imageLoaded = ref(false)
const imageError = ref(false)
const naturalSize = reactive({ width: 0, height: 0 })

const isUiVisible = ref(true)
const isMetadataPanelVisible = ref(false)

const currentImageMeta = computed((): IImageViewerImageMeta | null => {
  const meta = toRaw(props.images[props.currentIndex]?.meta)

  return meta || null
})
const imageStyle = computed(() => ({
  transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
  transition: (isAnimating.value && !isDragging.value && !wheeling.value)
    ? `transform ${props.animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`
    : 'none',
  cursor: getCursor(),
}))

const canZoomIn = computed(() => transform.scale < props.maxZoom)
const canZoomOut = computed(() => transform.scale > props.minZoom)

function getCursor(): string {
  if (isDragging.value)
    return 'grabbing'
  if (transform.scale > props.minZoom)
    return 'grab'
  return 'zoom-in'
}

watch(() => props.currentIndex, () => {
  resetTransform()
  isMetadataPanelVisible.value = false
})

watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    document.body.style.overflow = 'hidden'
    isUiVisible.value = true
  }
  else {
    document.body.style.overflow = ''
    resetTransform()
    isMetadataPanelVisible.value = false
  }
})

function resetTransform() {
  isAnimating.value = true
  transform.scale = props.minZoom
  transform.x = 0
  transform.y = 0
  setTimeout(() => {
    isAnimating.value = false
  }, props.animationDuration)
}

function calculateBounds(): ViewerBounds {
  if (!imageRef.value || !containerRef.value)
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }

  const containerRect = containerRef.value.getBoundingClientRect()
  const scaledWidth = naturalSize.width * transform.scale
  const scaledHeight = naturalSize.height * transform.scale
  const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2 / transform.scale)
  const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2 / transform.scale)

  return { minX: -maxX, maxX, minY: -maxY, maxY }
}

function constrainTransform() {
  const bounds = calculateBounds()
  transform.x = Math.max(bounds.minX, Math.min(bounds.maxX, transform.x))
  transform.y = Math.max(bounds.minY, Math.min(bounds.maxY, transform.y))
}

function zoomTo(newScale: number, centerX = 0, centerY = 0) {
  const clampedScale = Math.max(props.minZoom, Math.min(props.maxZoom, newScale))

  if (clampedScale === props.minZoom) {
    resetTransform()
    return
  }

  const scaleRatio = clampedScale / transform.scale
  isAnimating.value = true
  transform.x = centerX - (centerX - transform.x) * scaleRatio
  transform.y = centerY - (centerY - transform.y) * scaleRatio
  transform.scale = clampedScale

  nextTick(() => {
    constrainTransform()
    setTimeout(() => {
      isAnimating.value = false
    }, props.animationDuration)
  })
}

function zoomIn(centerX = 0, centerY = 0) {
  const newScale = Math.min(transform.scale + props.zoomStep, props.maxZoom)
  zoomTo(newScale, centerX, centerY)
}

function zoomOut(centerX = 0, centerY = 0) {
  const newScale = Math.max(transform.scale - props.zoomStep, props.minZoom)
  zoomTo(newScale, centerX, centerY)
}

function handleDoubleClick(event: MouseEvent) {
  event.preventDefault()
  if (!imageRef.value)
    return

  const rect = imageRef.value.getBoundingClientRect()
  const centerX = (event.clientX - rect.left - rect.width / 2) / transform.scale
  const centerY = (event.clientY - rect.top - rect.height / 2) / transform.scale

  if (transform.scale > props.minZoom) {
    resetTransform()
  }
  else {
    zoomTo(2, centerX, centerY)
  }
}

function handleWheel(event: WheelEvent) {
  event.preventDefault()

  if (!imageRef.value)
    return
  if (wheelTimeoutId)
    clearTimeout(wheelTimeoutId)

  wheeling.value = true
  isAnimating.value = false
  const oldScale = transform.scale
  const zoomFactor = 1.15
  const newScale = event.deltaY < 0 ? oldScale * zoomFactor : oldScale / zoomFactor
  const clampedScale = Math.max(props.minZoom, Math.min(props.maxZoom, newScale))

  if (clampedScale === oldScale) {
    wheeling.value = false

    return
  }
  if (clampedScale <= props.minZoom) {
    resetTransform()
    wheeling.value = false

    return
  }

  const rect = imageRef.value.getBoundingClientRect()
  const centerX = (event.clientX - rect.left - rect.width / 2) / oldScale
  const centerY = (event.clientY - rect.top - rect.height / 2) / oldScale
  const scaleRatio = clampedScale / oldScale
  transform.x = centerX - (centerX - transform.x) * scaleRatio
  transform.y = centerY - (centerY - transform.y) * scaleRatio
  transform.scale = clampedScale

  constrainTransform()

  wheelTimeoutId = window.setTimeout(() => {
    wheeling.value = false
    isAnimating.value = true
    constrainTransform()
  }, 150)
}

function handleMouseDown(event: MouseEvent) {
  if (transform.scale <= props.minZoom)
    return

  event.preventDefault()
  isDragging.value = true
  isAnimating.value = false
  dragStart.x = event.clientX
  dragStart.y = event.clientY
  transformStart.x = transform.x
  transformStart.y = transform.y
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp, { once: true })
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value)
    return

  const deltaX = (event.clientX - dragStart.x) / transform.scale
  const deltaY = (event.clientY - dragStart.y) / transform.scale
  transform.x = transformStart.x + deltaX
  transform.y = transformStart.y + deltaY
}

function handleMouseUp() {
  isDragging.value = false

  document.removeEventListener('mousemove', handleMouseMove)
  if (!wheeling.value) {
    isAnimating.value = true
  }

  constrainTransform()
}

function getTouchPoints(event: TouchEvent): TouchPoint[] {
  return Array.from(event.touches).map(touch => ({ x: touch.clientX, y: touch.clientY }))
}

function getDistance(point1: TouchPoint, point2: TouchPoint): number {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y

  return Math.sqrt(dx * dx + dy * dy)
}

function getCenter(point1: TouchPoint, point2: TouchPoint): TouchPoint {
  return { x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2 }
}

function handleTouchStart(event: TouchEvent) {
  if (!props.enableTouch)
    return

  event.preventDefault()
  isAnimating.value = false
  touches.value = getTouchPoints(event)

  if (touches.value.length === 1) {
    if (transform.scale > props.minZoom) {
      isDragging.value = true
      dragStart.x = touches.value[0].x
      dragStart.y = touches.value[0].y
      transformStart.x = transform.x
      transformStart.y = transform.y
    }
  }
  else if (touches.value.length === 2) {
    isDragging.value = false
    initialDistance.value = getDistance(touches.value[0], touches.value[1])
    initialScale.value = transform.scale
  }
}

function handleTouchMove(event: TouchEvent) {
  if (!props.enableTouch)
    return

  event.preventDefault()
  const currentTouches = getTouchPoints(event)

  if (isDragging.value && currentTouches.length === 1 && touches.value.length === 1) {
    if (transform.scale > props.minZoom) {
      const deltaX = (currentTouches[0].x - dragStart.x) / transform.scale
      const deltaY = (currentTouches[0].y - dragStart.y) / transform.scale
      transform.x = transformStart.x + deltaX
      transform.y = transformStart.y + deltaY
    }
  }
  else if (currentTouches.length === 2 && touches.value.length >= 2) {
    if (!imageRef.value)
      return

    const currentDistance = getDistance(currentTouches[0], currentTouches[1])
    const scaleRatio = currentDistance / initialDistance.value
    const newScale = Math.max(props.minZoom, Math.min(props.maxZoom, initialScale.value * scaleRatio))
    const rect = imageRef.value.getBoundingClientRect()
    const center = getCenter(currentTouches[0], currentTouches[1])
    const centerX = (center.x - rect.left - rect.width / 2) / transform.scale
    const centerY = (center.y - rect.top - rect.height / 2) / transform.scale
    const currentScaleRatio = newScale / transform.scale
    transform.x = centerX - (centerX - transform.x) * currentScaleRatio
    transform.y = centerY - (centerY - transform.y) * currentScaleRatio
    transform.scale = newScale
    initialDistance.value = currentDistance
    initialScale.value = newScale
  }
}

function handleTouchEnd(event: TouchEvent) {
  if (!props.enableTouch)
    return

  event.preventDefault()
  isAnimating.value = true
  constrainTransform()
  const remainingTouches = event.touches.length

  if (remainingTouches === 0) {
    isDragging.value = false
    touches.value = []
  }
  else if (remainingTouches === 1 && touches.value.length > 1) {
    isDragging.value = true
    dragStart.x = event.touches[0].clientX
    dragStart.y = event.touches[0].clientY
    transformStart.x = transform.x
    transformStart.y = transform.y
    touches.value = getTouchPoints(event)
  }
  else {
    touches.value = getTouchPoints(event)
  }
}

const currentImage = computed(() => props.images[props.currentIndex])
const hasMultipleImages = computed(() => props.images.length > 1)

function handleImageLoad() {
  imageLoaded.value = true
  imageError.value = false
  if (imageRef.value) {
    naturalSize.width = imageRef.value.naturalWidth
    naturalSize.height = imageRef.value.naturalHeight
    emit('imageLoad', currentImage.value)
  }
}

function handleImageError(event: Event) {
  imageLoaded.value = false
  imageError.value = true
  emit('imageError', event)
}

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
  if (props.closeOnOverlayClick && props.visible && !isDragging.value && transform.scale <= props.minZoom && !isMetadataPanelVisible.value) {
    close()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="viewer-fade">
      <div
        v-if="visible"
        class="image-viewer-overlay"
        @wheel="handleWheel"
        @touchstart.prevent="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend.prevent="handleTouchEnd"
        @touchcancel.prevent="handleTouchEnd"
      >
        <div ref="viewerContentRef" class="viewer-wrapper">
          <!-- Header with controls -->
          <div class="viewer-header">
            <!-- Элементы, которые скрываются -->
            <div v-if="isUiVisible" class="header-content-wrapper">
              <div class="header-left">
                <div v-if="showCounter && hasMultipleImages" class="viewer-counter">
                  {{ currentIndex + 1 }} / {{ images.length }}
                </div>
              </div>
              <div class="header-center">
                <div v-if="transform.scale > minZoom" class="scale-indicator">
                  {{ Math.round(transform.scale * 100) }}%
                </div>
              </div>
            </div>

            <!-- Элементы, которые видны всегда -->
            <div class="header-right">
              <div class="control-buttons">
                <!-- 2. Новая кнопка для скрытия/показа UI -->
                <button
                  class="control-btn"
                  :title="isUiVisible ? 'Скрыть интерфейс' : 'Показать интерфейс'"
                  @click="isUiVisible = !isUiVisible"
                >
                  <Icon :icon="isUiVisible ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
                </button>

                <!-- 3. Группа кнопок, которая будет скрываться -->
                <div v-if="isUiVisible" class="control-buttons-group">
                  <button
                    v-if="currentImageMeta"
                    class="control-btn"
                    title="Информация о снимке"
                    @click="isMetadataPanelVisible = true"
                  >
                    <Icon icon="mdi:information-outline" />
                  </button>
                  <button
                    class="control-btn"
                    title="Zoom out"
                    :disabled="!canZoomOut"
                    @click="zoomOut(0, 0)"
                  >
                    <Icon icon="mdi:minus" />
                  </button>
                  <button
                    class="control-btn"
                    title="Zoom in"
                    :disabled="!canZoomIn"
                    @click="zoomIn(0, 0)"
                  >
                    <Icon icon="mdi:plus" />
                  </button>
                  <button
                    class="control-btn"
                    title="Reset zoom"
                    :disabled="transform.scale <= minZoom"
                    @click="resetTransform"
                  >
                    <Icon icon="mdi:backup-restore" />
                  </button>
                </div>

                <!-- 4. Кнопка "Закрыть" всегда видима -->
                <button class="close-btn" title="Close" @click="close">
                  <Icon icon="mdi:close" />
                </button>
              </div>
            </div>
          </div>

          <!-- Main content area -->
          <div class="viewer-content">
            <!-- Previous button (скрываемый) -->
            <button
              v-if="hasMultipleImages && isUiVisible"
              class="nav-btn prev-btn"
              title="Previous image"
              @click="prev"
            >
              <Icon icon="mdi:chevron-left" />
            </button>

            <!-- Image container -->
            <div ref="containerRef" class="image-container">
              <div v-if="!imageLoaded && !imageError" class="image-placeholder">
                <div class="loading-spinner">
                  <Icon icon="mdi:loading" class="spinning" />
                </div>
                <span>Loading...</span>
              </div>
              <div v-else-if="imageError" class="image-error">
                <Icon icon="mdi:image-broken-variant" />
                <span>Failed to load image</span>
              </div>
              <img
                v-if="currentImage"
                :key="currentImage.url"
                ref="imageRef"
                v-resolve-src="currentImage.url"
                :alt="currentImage.alt || `Image ${currentIndex + 1}`"
                class="viewer-image"
                :class="{ loaded: imageLoaded }"
                :style="imageStyle"
                @load="handleImageLoad"
                @error="handleImageError"
                @mousedown="handleMouseDown"
                @dblclick="handleDoubleClick"
                @dragstart.prevent
              >
            </div>

            <!-- Next button (скрываемый) -->
            <button
              v-if="hasMultipleImages && isUiVisible"
              class="nav-btn next-btn"
              title="Next image"
              @click="next"
            >
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>

          <!-- Footer slot (скрываемый) -->
          <div v-if="$slots.footer && isUiVisible" class="viewer-footer">
            <slot
              name="footer"
              :image="currentImage"
              :index="currentIndex"
              :transform="transform"
            />
          </div>

          <!-- Thumbnails (скрываемые) -->
          <div v-if="enableThumbnails && hasMultipleImages && isUiVisible" class="thumbnails-container">
            <div class="thumbnails-wrapper">
              <button
                v-for="(image, index) in images"
                :key="`thumb-${index}`"
                class="thumbnail"
                :class="{ active: index === currentIndex }"
                :title="`Go to image ${index + 1}`"
                @click="goToIndex(index)"
              >
                <img :src="image.url" :alt="image.alt || `Thumbnail ${index + 1}`">
                <div v-if="index === currentIndex" class="thumbnail-indicator" />
              </button>
            </div>
          </div>
        </div>

        <ImageMetadataPanel
          v-if="currentImageMeta"
          :meta="currentImageMeta"
          :visible="isMetadataPanelVisible"
          @close="isMetadataPanelVisible = false"
        />
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
  z-index: 13;
  display: flex;
  flex-direction: column;
  touch-action: none;
  user-select: none;
}

.viewer-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
}

.viewer-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  z-index: 10;
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
}

.header-content-wrapper {
  display: contents;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left {
  position: absolute;
  left: 20px;
  top: 20px;
}
.header-center {
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
}
.header-right {
  position: absolute;
  right: 20px;
  top: 20px;
}

.viewer-counter,
.scale-indicator {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.scale-indicator {
  padding: 6px 12px;
  font-size: 12px;
  min-width: 50px;
  text-align: center;
}

.control-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.control-buttons-group {
  display: contents;
}

.control-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
  backdrop-filter: blur(12px);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.close-btn {
  background: rgba(220, 38, 38, 0.8);
  color: white;
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s ease;
  backdrop-filter: blur(12px);

  &:hover {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
}

.viewer-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.2s ease;
  backdrop-filter: blur(12px);
  z-index: 5;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.prev-btn {
    left: 20px;
  }

  &.next-btn {
    right: 20px;
  }
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 5%;
}

.image-placeholder,
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;

  .icon {
    font-size: 48px;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }
}

.viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: grab;
  transform-origin: center;
  transition: opacity 0.3s ease;
  opacity: 0;
  border-radius: var(--r-2xs);

  &.loaded {
    opacity: 1;
  }

  &:active {
    cursor: grabbing;
  }
}

.viewer-footer,
.thumbnails-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  max-width: calc(100% - 40px);
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
}

.viewer-footer {
  bottom: 0;
  padding: 8px 0;
  width: 100%;
  max-width: none;
  display: flex;
  justify-content: center;

  @include media-down(sm) {
    padding: 8px;
  }
}

.thumbnails-container {
  bottom: 20px;
}

.thumbnails-wrapper {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.thumbnail {
  position: relative;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    transform: scale(1.05);
  }

  &.active {
    border-color: #3b82f6;
    transform: scale(1.1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.thumbnail-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
}

// Transitions
.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}

.viewer-fade-fast-enter-active,
.viewer-fade-fast-leave-active {
  transition: opacity 0.15s ease;
}
.viewer-fade-fast-enter-from,
.viewer-fade-fast-leave-to {
  opacity: 0;
}

// Animations
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@include media-down(md) {
  .viewer-header,
  .header-center,
  .header-right {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    top: 0;
    left: 0px;
    right: 0px;
    padding: 16px 0;
  }
  .header-left {
    justify-content: flex-start;
  }
  .viewer-content {
    padding: 16px;
  }
  .control-btn,
  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  .close-btn {
    font-size: 18px;
  }
  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
    &.prev-btn {
      left: 16px;
    }
    &.next-btn {
      right: 16px;
    }
  }
  .viewer-counter {
    padding: 6px 12px;
    font-size: 12px;
  }
  .scale-indicator {
    padding: 4px 8px;
    font-size: 11px;
  }
  .thumbnails-container {
    bottom: 16px;
    max-width: calc(100% - 32px);
  }
  .thumbnail {
    width: 48px;
    height: 48px;
  }
  .control-buttons {
    gap: 6px;
  }
}

@include media-down(sm) {
  .viewer-header {
    display: block;
  }
  .header-left,
  .header-center {
    justify-content: flex-start;
  }
  .header-center {
    left: 50%;
    transform: translateX(-50%);
  }
  .header-right {
    right: 16px;
  }
}
</style>

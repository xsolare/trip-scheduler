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
  if (props.closeOnOverlayClick && props.visible) {
    close()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="faded">
      <div
        v-if="visible"
        class="image-viewer-overlay"
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

            <div class="image-container">
              <img
                v-if="currentImage"
                :src="currentImage.url"
                :alt="currentImage.alt || `Image ${currentIndex + 1}`"
                class="viewer-image"
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

          <div v-if="currentImage?.caption" class="image-caption">
            {{ currentImage.caption }}
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
  max-height: 100%;
}

.viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--r-m);
  box-shadow: 0 20px 60px var(--bg-overlay-primary-color);
  background: var(--bg-overlay-primary-color);
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

.image-caption {
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 12px 24px;
  border-radius: var(--r-xl);
  margin-top: 20px;
  text-align: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 80%;
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

@media (max-width: 767px) {
  .image-viewer-overlay {
    padding: 10px;
  }

  .viewer-header {
    top: 10px;
    right: 10px;
    left: 10px;
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
}
</style>

<script setup lang="ts">
import { AspectRatio } from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, readonly, ref, watch } from 'vue'
import { KitSkeleton } from '~/components/01.kit/kit-skeleton'

interface Props {
  src?: string
  alt?: string
  aspectRatio?: number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  loadTimeout?: number
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  aspectRatio: undefined,
  objectFit: 'cover',
  loading: 'lazy',
  loadTimeout: 10_000,
})

const isLoading = ref(true)
const hasError = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)
const loadTimeoutId = ref<NodeJS.Timeout | undefined>()
const imageObserver = ref<IntersectionObserver | undefined>()

const imageStyle = computed(() => ({
  objectFit: props.objectFit,
  opacity: !isLoading.value && !hasError.value ? 1 : 0,
}))

function handleLoad() {
  clearLoadTimeout()
  isLoading.value = false
  hasError.value = false
}

function handleError() {
  clearLoadTimeout()
  isLoading.value = false
  hasError.value = true
}

function checkImageState(imgElement: HTMLImageElement) {
  if (imgElement.complete) {
    if (imgElement.naturalWidth > 0) {
      handleLoad()
    }
    else {
      handleError()
    }
  }
}

function clearLoadTimeout() {
  if (loadTimeoutId.value) {
    clearTimeout(loadTimeoutId.value)
    loadTimeoutId.value = undefined
  }
}

function setLoadTimeout() {
  clearLoadTimeout()
  if (props.loadTimeout > 0) {
    loadTimeoutId.value = setTimeout(() => {
      if (isLoading.value) {
        handleError()
      }
    }, props.loadTimeout)
  }
}

function setupIntersectionObserver() {
  if (typeof window === 'undefined' || !imageRef.value || props.loading !== 'lazy') {
    return
  }

  cleanupObserver()

  imageObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && imageRef.value && isLoading.value) {
          checkImageState(imageRef.value)
          cleanupObserver()
        }
      })
    },
    { threshold: 0.1 },
  )

  imageObserver.value.observe(imageRef.value)
}

function cleanupObserver() {
  if (imageObserver.value) {
    imageObserver.value.disconnect()
    imageObserver.value = undefined
  }
}

watch(
  () => props.src,
  (newSrc) => {
    isLoading.value = true
    hasError.value = false
    cleanupObserver()

    if (!newSrc)
      return

    setLoadTimeout()

    nextTick(() => {
      if (imageRef.value) {
        if (props.loading === 'eager') {
          checkImageState(imageRef.value)
        }
        else {
          setupIntersectionObserver()
        }
      }
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearLoadTimeout()
  cleanupObserver()
})

defineExpose({
  isLoading: readonly(isLoading),
  hasError: readonly(hasError),
  retry: () => {
    if (props.src && hasError.value) {
      isLoading.value = true
      hasError.value = false
      setLoadTimeout()
    }
  },
})
</script>

<template>
  <component :is="aspectRatio ? AspectRatio : 'div'" :ratio="aspectRatio" class="kit-image-wrapper">
    <div class="kit-image-container">
      <!-- Слот для лоудера с Skeleton по умолчанию -->
      <transition name="faded">
        <div v-if="isLoading" class="placeholder-wrapper">
          <slot name="loader">
            <KitSkeleton
              class="skeleton-placeholder"
            />
          </slot>
        </div>
      </transition>

      <!-- Слот для ошибки с заглушкой по умолчанию -->
      <transition name="faded">
        <div v-if="hasError" class="placeholder-wrapper">
          <slot name="error">
            <div class="error-placeholder">
              <img src="/images/smth-wrong.png" alt="Ошибка загрузки" class="error-image">
            </div>
          </slot>
        </div>
      </transition>

      <!-- Само изображение. Оно всегда в DOM (если есть src), но его видимостью управляет opacity -->
      <img
        v-if="src"
        ref="imageRef"
        v-resolve-src="src"
        class="image"
        :alt="alt"
        :loading="loading"
        :style="imageStyle"
        @load="handleLoad"
        @error="handleError"
      >
    </div>
  </component>
</template>

<style lang="scss">
.kit-image-wrapper {
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.kit-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;

  .placeholder-wrapper,
  .image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    .skeleton-placeholder {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .image {
    transition: opacity 0.3s ease-out;
  }

  .error-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--bg-tertiary-color);
    border-radius: inherit;
  }

  .error-image {
    width: 50%;
    height: 50%;
    object-fit: contain;
    opacity: 0.5;
  }
}
</style>

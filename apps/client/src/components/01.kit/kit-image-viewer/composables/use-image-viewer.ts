import type { ImageViewerImage, ImageViewerOptions } from '../models/types'

export function useImageViewer(options: ImageViewerOptions = {}) {
  const {
    enableKeyboard = true,
  } = options

  const isOpen = ref(false)
  const images = ref<ImageViewerImage[]>([])
  const currentIndex = ref(0)

  const currentImage = computed(() => images.value[currentIndex.value])
  const hasMultipleImages = computed(() => images.value.length > 1)

  let originalOverflow = ''

  watch(isOpen, (value) => {
    if (value) {
      originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = originalOverflow
    }
  })

  onUnmounted(() => {
    document.body.style.overflow = originalOverflow
  })

  function open(imageList: ImageViewerImage[], startIndex = 0) {
    images.value = imageList
    currentIndex.value = Math.max(0, Math.min(startIndex, imageList.length - 1))
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function next() {
    if (!hasMultipleImages.value)
      return
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }

  function prev() {
    if (!hasMultipleImages.value)
      return
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
  }

  function goToIndex(index: number) {
    if (index >= 0 && index < images.value.length) {
      currentIndex.value = index
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen.value || !enableKeyboard)
      return

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        next()
        break
      case 'ArrowLeft':
        e.preventDefault()
        prev()
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
    }
  }

  if (enableKeyboard) {
    useEventListener(document, 'keydown', handleKeydown)
  }

  return {
    isOpen,
    currentImage,
    currentIndex,
    hasMultipleImages,
    images,
    open,
    close,
    next,
    prev,
    goToIndex,
  }
}

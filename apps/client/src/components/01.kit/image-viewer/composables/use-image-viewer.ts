import type { ImageViewerImage, ImageViewerOptions } from '../models/types'

export function useImageViewer(options: ImageViewerOptions = {}) {
  const {
    enableKeyboard = true,
    // enableThumbnails = false,
    // showCounter = true,
    // closeOnOverlayClick = true,
  } = options

  const isOpen = ref(false)
  const images = ref<ImageViewerImage[]>([])
  const currentIndex = ref(0)

  const currentImage = computed(() => images.value[currentIndex.value])
  const hasMultipleImages = computed(() => images.value.length > 1)

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

  // Обработка клавиатуры
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

  // Подключаем обработчик клавиатуры
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

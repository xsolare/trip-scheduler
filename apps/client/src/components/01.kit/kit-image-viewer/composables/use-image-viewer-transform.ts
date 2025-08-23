import type { MaybeRefOrGetter, Ref } from 'vue'
import type { TouchPoint, ViewerBounds, ViewerTransform } from '../models/types'

interface UseImageViewerTransformOptions {
  imageRef: Ref<HTMLImageElement | null>
  containerRef: Ref<HTMLElement | null>
  naturalSize: { width: number, height: number }
  minZoom: MaybeRefOrGetter<number>
  maxZoom: MaybeRefOrGetter<number>
  zoomStep: MaybeRefOrGetter<number>
  enableTouch: MaybeRefOrGetter<boolean>
  animationDuration: MaybeRefOrGetter<number>
}

export function useImageViewerTransform(options: UseImageViewerTransformOptions) {
  const { imageRef, containerRef, naturalSize, minZoom, maxZoom, zoomStep, enableTouch, animationDuration } = options

  // --- Состояние трансформации ---
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

  // --- Вычисляемые свойства ---
  const imageStyle = computed(() => ({
    transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
    transition: (isAnimating.value && !isDragging.value && !wheeling.value)
      ? `transform ${toValue(animationDuration)}ms cubic-bezier(0.4, 0.0, 0.2, 1)`
      : 'none',
    cursor: getCursor(),
  }))

  const canZoomIn = computed(() => transform.scale < toValue(maxZoom))
  const canZoomOut = computed(() => transform.scale > toValue(minZoom))

  function getCursor(): string {
    if (isDragging.value)
      return 'grabbing'
    if (transform.scale > toValue(minZoom))
      return 'grab'
    return 'zoom-in'
  }

  // --- Функции трансформации ---
  function resetTransform() {
    isAnimating.value = true
    transform.scale = toValue(minZoom)
    transform.x = 0
    transform.y = 0
    setTimeout(() => {
      isAnimating.value = false
    }, toValue(animationDuration))
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
    const clampedScale = Math.max(toValue(minZoom), Math.min(toValue(maxZoom), newScale))

    if (clampedScale === toValue(minZoom)) {
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
      }, toValue(animationDuration))
    })
  }

  function zoomIn(centerX = 0, centerY = 0) {
    const newScale = Math.min(transform.scale + toValue(zoomStep), toValue(maxZoom))
    zoomTo(newScale, centerX, centerY)
  }

  function zoomOut(centerX = 0, centerY = 0) {
    const newScale = Math.max(transform.scale - toValue(zoomStep), toValue(minZoom))
    zoomTo(newScale, centerX, centerY)
  }

  // --- Обработчики событий ---
  function handleDoubleClick(event: MouseEvent) {
    event.preventDefault()
    if (!imageRef.value)
      return

    const rect = imageRef.value.getBoundingClientRect()
    const centerX = (event.clientX - rect.left - rect.width / 2) / transform.scale
    const centerY = (event.clientY - rect.top - rect.height / 2) / transform.scale

    if (transform.scale > toValue(minZoom))
      resetTransform()
    else
      zoomTo(2, centerX, centerY)
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
    const clampedScale = Math.max(toValue(minZoom), Math.min(toValue(maxZoom), newScale))

    if (clampedScale === oldScale) {
      wheeling.value = false
      return
    }
    if (clampedScale <= toValue(minZoom)) {
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
    if (transform.scale <= toValue(minZoom))
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
    if (!wheeling.value)
      isAnimating.value = true

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
    if (!toValue(enableTouch))
      return
    const target = event.target as HTMLElement
    if (target.closest('button'))
      return

    event.preventDefault()
    isAnimating.value = false
    touches.value = getTouchPoints(event)

    if (touches.value.length === 1) {
      if (transform.scale > toValue(minZoom)) {
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
    if (!toValue(enableTouch))
      return
    if (!isDragging.value && touches.value.length < 2)
      return
    event.preventDefault()

    const currentTouches = getTouchPoints(event)

    if (isDragging.value && currentTouches.length === 1 && touches.value.length === 1) {
      if (transform.scale > toValue(minZoom)) {
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
      const newScale = Math.max(toValue(minZoom), Math.min(toValue(maxZoom), initialScale.value * scaleRatio))
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
    if (!toValue(enableTouch))
      return
    if (!isDragging.value && touches.value.length === 0)
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

  tryOnUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    transform,
    isDragging,
    imageStyle,
    canZoomIn,
    canZoomOut,
    handleDoubleClick,
    handleWheel,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    zoomIn,
    zoomOut,
    resetTransform,
  }
}

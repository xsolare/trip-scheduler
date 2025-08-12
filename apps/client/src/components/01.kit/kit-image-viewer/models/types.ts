export interface ImageViewerImage {
  url: string
  alt?: string
  caption?: string
  meta?: any
}

export interface ImageViewerOptions {
  enableKeyboard?: boolean
  enableTouch?: boolean
  maxZoom?: number
  minZoom?: number
  zoomStep?: number
  animationDuration?: number
}

export interface ViewerTransform {
  scale: number
  x: number
  y: number
}

export interface ViewerBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface TouchPoint {
  x: number
  y: number
}

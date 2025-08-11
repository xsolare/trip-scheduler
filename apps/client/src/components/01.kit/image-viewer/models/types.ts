export interface ImageViewerImage {
  url: string
  alt?: string
  caption?: string
  meta?: any
}

export interface ImageViewerOptions {
  enableKeyboard?: boolean
  enableThumbnails?: boolean
  showCounter?: boolean
  closeOnOverlayClick?: boolean
}

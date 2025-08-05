export interface ImageViewerImage {
  url: string
  alt?: string
  caption?: string
}

export interface ImageViewerOptions {
  enableKeyboard?: boolean
  enableThumbnails?: boolean
  showCounter?: boolean
  closeOnOverlayClick?: boolean
}

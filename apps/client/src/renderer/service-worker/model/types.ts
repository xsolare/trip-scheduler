/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference types="@types/workbox-sw" />

type AssetType = 'hashed' | 'vendor' | 'regular'

interface ServiceWorkerMessage {
  type: 'SKIP_WAITING' | 'GET_CACHE_INFO' | 'CLEAR_CACHE'
  payload?: {
    cacheName?: string
  }
}

interface CacheInfo {
  name: string
  size: number
  urls: string[]
  totalSize?: number
}

const CACHE_CONFIG = {
  names: {
    webmanifest: 'trip-scheduler-pwa-webmanifest',
    fonts: 'trip-scheduler-fonts',
    images: 'trip-scheduler-images',
    icons: 'trip-scheduler-icons',
    hashedAssets: 'trip-scheduler-hashed-assets',
    vendorAssets: 'trip-scheduler-vendor-assets',
    regularAssets: 'trip-scheduler-regular-assets',
  },
  durations: {
    images: 365 * 24 * 60 * 60,
    fonts: 365 * 24 * 60 * 60,
    icons: 30 * 24 * 60 * 60,
    static: {
      hashed: 365 * 24 * 60 * 60,
      vendor: 30 * 24 * 60 * 60,
      regular: 2 * 60 * 60,
    },
    manifests: 7 * 24 * 60 * 60,
  },
  limits: {
    fonts: 30,
    images: 1000,
    icons: 500,
    hashedAssets: 200,
    vendorAssets: 100,
    regularAssets: 50,
    manifests: 100,
  },
} as const

interface ApiCacheRule {
  path: string
  cacheName: string
  strategy: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate'
  maxAgeSeconds: number
  maxEntries: number
}

const API_CACHE_RULES: ApiCacheRule[] = [
  {
    path: 'trip.list',
    cacheName: 'trip-scheduler-api-trips',
    strategy: 'StaleWhileRevalidate',
    maxAgeSeconds: 1 * 60 * 60, // 1 час
    maxEntries: 10,
  },
  {
    path: 'day.getByTripId',
    cacheName: 'trip-scheduler-api-days',
    strategy: 'StaleWhileRevalidate',
    maxAgeSeconds: 1 * 60 * 60, // 1 час
    maxEntries: 50,
  },
  {
    path: 'trip.getById',
    cacheName: 'trip-scheduler-api-trip-details',
    strategy: 'StaleWhileRevalidate',
    maxAgeSeconds: 1 * 60 * 60, // 1 час
    maxEntries: 20,
  },
  {
    path: 'memory.getByTripId',
    cacheName: 'trip-scheduler-api-memories',
    strategy: 'StaleWhileRevalidate',
    maxAgeSeconds: 1 * 60 * 60, // 1 час
    maxEntries: 50,
  },
  {
    path: 'image.listByTrip',
    cacheName: 'trip-scheduler-api-route-images',
    strategy: 'StaleWhileRevalidate',
    maxAgeSeconds: 1 * 60 * 60, // 1 час
    maxEntries: 50,
  },
]

interface MessageHandlers {
  SKIP_WAITING: () => Promise<void>
  GET_CACHE_INFO: (port: MessagePort) => Promise<void>
  CLEAR_CACHE: (port: MessagePort, payload?: { cacheName?: string }) => Promise<void>
}

interface MessageHandlers {
  SKIP_WAITING: () => Promise<void>
  GET_CACHE_INFO: (port: MessagePort) => Promise<void>
  CLEAR_CACHE: (port: MessagePort, payload?: { cacheName?: string }) => Promise<void>
}

export {
  API_CACHE_RULES,
  type AssetType,
  CACHE_CONFIG,
  type CacheInfo,
  type MessageHandlers,
  type ServiceWorkerMessage,
}

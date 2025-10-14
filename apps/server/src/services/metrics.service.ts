import { collectDefaultMetrics, Counter, Gauge, Histogram, register } from 'prom-client'

// Включаем сбор стандартных метрик (CPU, память и т.д.)
register.setDefaultLabels({
  app: 'trip-scheduler-server',
})

// Собирает event loop lag, gc stats, heap usage и т.д.
collectDefaultMetrics({ prefix: 'nodejs_' })

// 1. Счетчик HTTP-запросов
export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code'],
})

// 2. Гистограмма длительности HTTP-запросов (в секундах)
export const httpRequestDurationHistogram = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5], // Настройте бакеты под ваше приложение
})

// 3. Счетчик tRPC процедур
export const trpcRequestCounter = new Counter({
  name: 'trpc_requests_total',
  help: 'Total number of tRPC requests',
  labelNames: ['path', 'type', 'status'], // path - 'trip.getById', type - 'query' | 'mutation', status - 'success' | 'error'
})

// 4. Гистограмма длительности tRPC процедур
export const trpcRequestDurationHistogram = new Histogram({
  name: 'trpc_request_duration_seconds',
  help: 'Duration of tRPC requests in seconds',
  labelNames: ['path', 'type', 'status'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
})

// 5. Gauge для количества пользователей
export const totalUsersGauge = new Gauge({
  name: 'total_registered_users',
  help: 'Total number of registered users in the database',
})

// 6. Gauge для количества путешествий
export const totalTripsGauge = new Gauge({
  name: 'total_trips_in_database',
  help: 'Total number of trips in the database',
})

// 7. Gauge для активных сессий (по refresh токенам)
export const activeSessionsGauge = new Gauge({
  name: 'active_user_sessions',
  help: 'Number of active user sessions based on valid refresh tokens',
})

// 8. Счетчик загрузок файлов
export const fileUploadsCounter = new Counter({
  name: 'file_uploads_total',
  help: 'Total number of uploaded files',
  labelNames: ['placement'], // e.g., 'memories', 'route', 'avatar'
})

// 9. Гистограмма размеров загруженных файлов (в байтах)
export const fileUploadSizeBytesHistogram = new Histogram({
  name: 'file_upload_size_bytes',
  help: 'Size distribution of uploaded files in bytes',
  labelNames: ['placement'],
  buckets: [100000, 500000, 1000000, 5000000, 10000000, 25000000], // 100KB, 500KB, 1MB, 5MB, 10MB, 25MB
})

// Экспортируем register для создания эндпоинта
export { register }

import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { authController } from './api/auth.controller'
import { avatarController } from './api/avatar.controller'
import { uploadFileController } from './api/upload.controller'
import { createContext } from './lib/trpc'
import { appRouter } from './router'
import { httpRequestCounter, httpRequestDurationHistogram, register } from './services/metrics.service'

const app = new Hono()

// Список разрешенных источников
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server для веб-разработки
  'http://localhost:1420', // Vite preview
  'capacitor://localhost', // Android Capacitor
  'http://localhost', // Capacitor
  'https://localhost', // Capacitor
  'capacitor://localhost', // Capacitor
  'http://trip-scheduler.ru', // Production-домен
  'https://trip-scheduler.ru', // Production-домен с https
]

app.use('*', async (c, next) => {
  const start = Date.now()
  try {
    await next()
  }
  finally {
    const duration = (Date.now() - start) / 1000
    const path = new URL(c.req.url).pathname

    if (path !== '/metrics') {
      httpRequestDurationHistogram.observe(
        {
          method: c.req.method,
          path,
          status_code: c.res.status,
        },
        duration,
      )
      httpRequestCounter.inc({
        method: c.req.method,
        path,
        status_code: c.res.status,
      })
    }
  }
})

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return origin
      }
      return null
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
)

// Определение API маршрутов
const apiRoutes = new Hono()
  .post('/upload', uploadFileController)
  .route('/avatar', avatarController)
  .route('/auth', authController)

app.route('/api', apiRoutes)
app.use('/static/*', serveStatic({ root: './' }))

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`tRPC Error on ${path}:`, error)
    },
  }),
)

app.get('/metrics', async (c) => {
  c.header('Content-Type', register.contentType)
  return c.body(await register.metrics())
})

// 404 handler
app.notFound(c => c.json({ error: 'Not Found' }, 404))

// Error handler
app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return error.getResponse()
  }
  console.error('Application error:', error)
  return c.json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  }, 500)
})

export default app

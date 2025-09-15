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

const app = new Hono()

app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:1420',
      'tauri://localhost',
      'http://trip-scheduler.ru',
      'https://trip-scheduler.ru',
    ],
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

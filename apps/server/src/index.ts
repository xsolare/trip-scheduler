import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { uploadFileHandler } from './api/upload.controller'
import { appRouter } from './router'

const app = new Hono()

const apiRoutes = new Hono().post('/upload', uploadFileHandler)

app.route('/api', apiRoutes)
app.use('/static/*', serveStatic({ root: './' }))

// tRPC middleware
app.use(
  '/trpc/*',
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:1420',
      'tauri://localhost',
    ],
    credentials: true,
  }),
  trpcServer({
    router: appRouter,
    createContext: () => ({}),
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
    // eslint-disable-next-line node/prefer-global/process
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  }, 500)
})

export default app

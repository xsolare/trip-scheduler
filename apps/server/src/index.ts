import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './router'

const app = new Hono()

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))

// tRPC middleware
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: () => ({}),
    onError: ({ error, path }) => {
      console.error(`tRPC Error on ${path}:`, error)
    },
  }),
)

// Health check
app.get('/', c => c.json({
  name: 'Trip Scheduler API',
  version: '1.0.0',
  status: 'healthy',
  timestamp: new Date().toISOString(),
  docs: '/docs',
}))

// 404 handler
app.notFound(c => c.json({ error: 'Not Found' }, 404))

// Error handler
app.onError((error, c) => {
  console.error('Application error:', error)
  return c.json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  }, 500)
})

export default app

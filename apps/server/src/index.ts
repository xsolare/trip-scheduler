import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './router'

const app = new Hono()

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
  console.error('Application error:', error)
  return c.json({
    error: 'Internal Server Error',
    // eslint-disable-next-line node/prefer-global/process
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  }, 500)
})

export default app

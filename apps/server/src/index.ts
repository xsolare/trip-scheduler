import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { appRouter } from './router'

const app = new Hono()

const apiRoutes = new Hono()
  .post('/upload', async (c) => {
    const formData = await c.req.formData()
    const file = formData.get('file')
    const tripId = formData.get('tripId')

    if (!file || !(file instanceof File)) {
      throw new HTTPException(400, { message: 'Файл не найден в запросе.' })
    }
    if (!tripId || typeof tripId !== 'string') {
      throw new HTTPException(400, { message: 'Необходимо указать ID путешествия (tripId).' })
    }

    const fileExtension = file.name.split('.').pop()
    const filename = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`

    const tripUploadDir = join('./public/uploads', tripId)
    const fullPath = join(tripUploadDir, filename)

    try {
      await mkdir(tripUploadDir, { recursive: true })

      await Bun.write(fullPath, await file.arrayBuffer())

      const baseURL = import.meta.env.API_URL
      const url = `${baseURL}/static/uploads/${tripId}/${filename}`

      return c.json({ success: true, url })
    }
    catch (error) {
      console.error('Ошибка при сохранении файла:', error)
      throw new HTTPException(500, { message: 'Не удалось сохранить файл.' })
    }
  })

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

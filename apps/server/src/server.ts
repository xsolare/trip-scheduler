/* eslint-disable no-console */
/* eslint-disable node/prefer-global/process */
import app from './index'

const port = Number(process.env.PORT) || 3000
const host = process.env.HOST || '0.0.0.0'

console.log(`🚀 Trip Scheduler API starting...`)
console.log(`📍 Server running at http://${host}:${port}`)
console.log(`📚 API Documentation available at http://${host}:${port}/docs`)

export default {
  port,
  hostname: host,
  fetch: app.fetch,
}

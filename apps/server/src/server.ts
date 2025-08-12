/* eslint-disable no-console */

import app from './index'

const port = Number(process.env.PORT) || 8080
const host = process.env.HOST || '0.0.0.0'

console.log(`🚀 Trip Scheduler API starting...`)
console.log(`📍 Server running at http://${host}:${port}`)

export default {
  port,
  hostname: host,
  fetch: app.fetch,
}

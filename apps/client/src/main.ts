import { createPinia } from 'pinia'
import { createApp } from 'vue'

import router from '~/shared/lib/router'
import { initializePwaUpdater } from '~/shared/services/pwa/pwa.service'

// @ts-expect-error бред какой то
import application from './app.vue'
import { requestPlugin } from './plugins/request'
import { restoreSession } from './plugins/session-restore'
import { themePlugin } from './plugins/theme'
import { resolveSrc } from './shared/directives/resolve-src'
import databaseServicePromise from './shared/services/database'

/**
 * Асинхронная функция для инициализации приложения.
 */
async function initializeApp() {
  const app = createApp(application)
  const pinia = createPinia()

  app.directive('resolve-src', resolveSrc)

  app.use(pinia)
  app.use(requestPlugin, { databaseService: databaseServicePromise })
  app.use(router)
  app.use(themePlugin)

  await restoreSession(pinia)

  app.mount('#app')

  initializePwaUpdater()
}

initializeApp()

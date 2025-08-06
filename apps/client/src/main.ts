import { createPinia } from 'pinia'
import { createApp } from 'vue'

import router from '~/shared/lib/router'
import { initializePwaUpdater } from '~/shared/services/pwa/pwa.service'

// @ts-expect-error бред какой то
import application from './app.vue'
import { requestPlugin } from './plugins/request'
import { themePlugin } from './plugins/theme'
import databaseServicePromise from './shared/services/database'

const pinia = createPinia()
const app = createApp(application)

app.use(router)
app.use(pinia)
app.use(requestPlugin, { databaseService: databaseServicePromise })
app.use(themePlugin)

app.mount('#app')

initializePwaUpdater()

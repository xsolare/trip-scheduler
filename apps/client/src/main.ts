import { createPinia } from 'pinia'
import { createApp } from 'vue'

import router from '~/shared/lib/router'
import { initializePwaUpdater } from '~/shared/services/pwa/pwa.service'

import app from './app.vue'

const pinia = createPinia()
const appInstance = createApp(app)

appInstance.use(router)
appInstance.use(pinia)

appInstance.mount('#app')

initializePwaUpdater()

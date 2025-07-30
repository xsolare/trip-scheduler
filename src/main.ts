import { createPinia } from 'pinia'

import router from '~/shared/lib/router'

import app from './app.vue'

const pinia = createPinia()
const appInstance = createApp(app)

appInstance.use(router)
appInstance.use(pinia)

appInstance.mount('#app')

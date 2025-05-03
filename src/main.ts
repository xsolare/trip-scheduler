import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import router from '~/shared/lib/router'

import App from './App.vue'
import { PrimeVueConfig } from './shared/lib/primevue-theme'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(PrimeVue, PrimeVueConfig)

app.mount('#app')

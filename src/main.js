
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerPlugins } from '@/plugins/index'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
registerPlugins(app)// 引入vuetify

app.mount('#app')

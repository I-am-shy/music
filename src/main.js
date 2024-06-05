

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerPlugins } from '@/plugins/index'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
registerPlugins(app)// 引入vuetify

app.mount('#app')

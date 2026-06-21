import './assets/main.css'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { Notify, Quasar } from 'quasar'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(Quasar, { plugins: { Notify } })
app.use(router)

app.mount('#app')

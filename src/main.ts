import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { Notify, Quasar } from 'quasar'

const app = createApp(App)

app.use(createPinia())
app.use(Quasar, { plugins: { Notify } })

app.mount('#app')

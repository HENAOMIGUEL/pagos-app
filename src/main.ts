import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Loading, Notify, Quasar } from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './core/router/routes'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: { Loading, Notify },
})

app.mount('#app')

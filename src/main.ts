import './assets/main.css'
import 'vue-sonner/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import { configureApiAuth } from './api/api-auth'
import { useAuthStore } from './modules/auth'

const app = createApp(App)

app.use(createPinia())
app.use(VueQueryPlugin)
app.use(router)

const authStore = useAuthStore()
configureApiAuth({
  getAccessToken: () => authStore.accessToken,
  onUnauthorized: () => {
    authStore.clearSession()
    router.push({ name: 'login' })
  },
})

app.mount('#app')

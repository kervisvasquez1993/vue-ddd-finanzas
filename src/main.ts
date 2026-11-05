import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { configureApiAuth } from './infrastructure/api/api-auth'
import { useAuthStore } from './presentation/stores/auth.store'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
configureApiAuth({
  getAccessToken: () => authStore.accessToken,
  onUnauthorized: () => authStore.clearSession(),
})

app.mount('#app')

import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: () => import('@/presentation/views/home/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { guestOnly: true },
      component: () => import('@/presentation/views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: { guestOnly: true },
      component: () => import('@/presentation/views/auth/RegisterView.vue'),
    },
  ],
})

router.beforeEach(authGuard)

export default router

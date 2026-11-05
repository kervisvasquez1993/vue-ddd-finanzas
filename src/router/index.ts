import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { authRoutes } from '@/modules/auth/routes'
import { categoryRoutes } from '@/modules/category/routes'
import { dashboardRoutes } from '@/modules/dashboard/routes'
import { transactionRoutes } from '@/modules/transaction/routes'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [...dashboardRoutes, ...transactionRoutes, ...categoryRoutes],
    },
    ...authRoutes,
  ],
})

router.beforeEach(authGuard)

export default router

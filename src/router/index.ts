import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      meta: { requiresAuth: true },
      component: () => import('@/presentation/views/dashboard/DashboardView.vue'),
    },
    {
      path: '/transactions',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'transactions',
          component: () => import('@/presentation/views/transaction/TransactionsView.vue'),
        },
        {
          path: 'new',
          name: 'transactions-create',
          component: () => import('@/presentation/views/transaction/CreateTransactionView.vue'),
        },
        {
          path: ':id/edit',
          name: 'transactions-edit',
          props: true,
          component: () => import('@/presentation/views/transaction/EditTransactionView.vue'),
        },
      ],
    },
    {
      path: '/categories',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'categories',
          component: () => import('@/presentation/views/category/CategoriesView.vue'),
        },
        {
          path: 'new',
          name: 'categories-create',
          component: () => import('@/presentation/views/category/CreateCategoryView.vue'),
        },
        {
          path: ':id/edit',
          name: 'categories-edit',
          props: true,
          component: () => import('@/presentation/views/category/EditCategoryView.vue'),
        },
      ],
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

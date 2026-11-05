import type { RouteRecordRaw } from 'vue-router'

export const transactionRoutes: RouteRecordRaw[] = [
  {
    path: 'transactions',
    children: [
      {
        path: '',
        name: 'transactions',
        component: () => import('./presentation/views/TransactionsView.vue'),
      },
      {
        path: 'new',
        name: 'transactions-create',
        component: () => import('./presentation/views/CreateTransactionView.vue'),
      },
      {
        path: ':id/edit',
        name: 'transactions-edit',
        props: true,
        component: () => import('./presentation/views/EditTransactionView.vue'),
      },
    ],
  },
]

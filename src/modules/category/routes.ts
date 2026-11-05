import type { RouteRecordRaw } from 'vue-router'

export const categoryRoutes: RouteRecordRaw[] = [
  {
    path: 'categories',
    children: [
      {
        path: '',
        name: 'categories',
        component: () => import('./presentation/views/CategoriesView.vue'),
      },
      {
        path: 'new',
        name: 'categories-create',
        component: () => import('./presentation/views/CreateCategoryView.vue'),
      },
      {
        path: ':id/edit',
        name: 'categories-edit',
        props: true,
        component: () => import('./presentation/views/EditCategoryView.vue'),
      },
    ],
  },
]

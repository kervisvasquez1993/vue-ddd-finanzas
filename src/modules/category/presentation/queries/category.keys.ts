import { queryRoots } from '@/shared/presentation/queries/query-roots'

export const categoryKeys = {
  all: queryRoots.categories,
  list: [...queryRoots.categories, 'list'] as const,
  summaries: [...queryRoots.categories, 'summaries'] as const,
  detail: (id: string) => [...queryRoots.categories, 'detail', id] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
  summaries: ['categories', 'summaries'] as const,
  detail: (id: string) => ['categories', 'detail', id] as const,
}

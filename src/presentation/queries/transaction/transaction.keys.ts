import type { ITransactionFilters } from '@/domain/transaction/dto'

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (filters: ITransactionFilters) => ['transactions', 'list', filters] as const,
  detail: (id: string) => ['transactions', 'detail', id] as const,
}

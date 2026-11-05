import type { ITransactionFilters } from '@/modules/transaction/domain/dto'
import { queryRoots } from '@/shared/presentation/queries/query-roots'

export const transactionKeys = {
  all: queryRoots.transactions,
  list: (filters: ITransactionFilters) => [...queryRoots.transactions, 'list', filters] as const,
  detail: (id: string) => [...queryRoots.transactions, 'detail', id] as const,
}

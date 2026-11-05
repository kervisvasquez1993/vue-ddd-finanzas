import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { getTransactionsUseCase } from '@/modules/transaction/di'
import type { ITransactionFilters } from '@/modules/transaction/domain/dto'
import { shouldRetryQuery } from '@/shared/presentation/queries/should-retry-query'
import { transactionKeys } from './transaction.keys'

export const useTransactionsQuery = (filters: MaybeRefOrGetter<ITransactionFilters>) =>
  useQuery({
    queryKey: computed(() => transactionKeys.list(toValue(filters))),
    queryFn: () => getTransactionsUseCase(toValue(filters)),
    placeholderData: keepPreviousData,
    retry: shouldRetryQuery,
  })

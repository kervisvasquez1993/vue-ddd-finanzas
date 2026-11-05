import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { getTransactionUseCase } from '@/modules/transaction/di'
import { shouldRetryQuery } from '@/shared/presentation/queries/should-retry-query'
import { transactionKeys } from './transaction.keys'

export const useTransactionQuery = (id: MaybeRefOrGetter<string>) =>
  useQuery({
    queryKey: computed(() => transactionKeys.detail(toValue(id))),
    queryFn: () => getTransactionUseCase(toValue(id)),
    retry: shouldRetryQuery,
  })

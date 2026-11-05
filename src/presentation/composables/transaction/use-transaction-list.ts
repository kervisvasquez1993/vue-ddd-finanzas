import { computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { DomainError } from '@/domain/shared/errors'
import type { TransactionEntity } from '@/domain/transaction/entities'
import { useConfirmAction } from '@/presentation/composables/shared/use-confirm-action'
import { useDeleteTransactionMutation } from '@/presentation/mutations/transaction'
import { useTransactionsQuery } from '@/presentation/queries/transaction'
import { useTransactionFilters } from './use-transaction-filters'

export const useTransactionList = () => {
  const filterState = useTransactionFilters()
  const { filters, setPage } = filterState

  const query = useTransactionsQuery(filters)
  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransactionMutation()

  const {
    target: transactionToDelete,
    isOpen: isDeleteDialogOpen,
    ask: askToDelete,
    close: closeDeleteDialog,
  } = useConfirmAction<TransactionEntity>()

  const transactions = computed(() => query.data.value?.items)
  const page = computed(() => query.data.value?.page ?? 1)
  const total = computed(() => query.data.value?.total ?? 0)
  const totalPages = computed(() => query.data.value?.totalPages ?? 1)

  const errorMessage = computed(() =>
    query.error.value instanceof DomainError
      ? query.error.value.message
      : 'No pudimos cargar las transacciones. Inténtalo de nuevo.',
  )

  // Una página fuera de rango responde 200 con lista vacía, por ejemplo al borrar el último
  // elemento de la última página.
  watch(query.data, (result) => {
    if (result && !result.items.length && result.page > result.totalPages) {
      setPage(result.totalPages)
    }
  })

  const confirmDelete = () => {
    if (!transactionToDelete.value) return

    deleteTransaction(transactionToDelete.value.id, {
      onSuccess: () => toast.success('Transacción eliminada'),
      onError: (error) =>
        toast.error(error instanceof DomainError ? error.message : 'No pudimos eliminarla'),
      onSettled: closeDeleteDialog,
    })
  }

  return {
    ...filterState,
    transactions,
    page,
    total,
    totalPages,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage,
    refetch: query.refetch,
    transactionToDelete,
    isDeleteDialogOpen,
    isDeleting,
    askToDelete,
    confirmDelete,
  }
}

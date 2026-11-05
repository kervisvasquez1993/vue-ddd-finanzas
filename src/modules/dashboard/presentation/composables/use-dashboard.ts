import { computed, ref } from 'vue'
import { useDashboardQuery } from '@/modules/dashboard/presentation/queries'
import type { IDashboardFilters } from '@/modules/dashboard/domain/dto'
import { DomainError } from '@/shared/domain/errors'
import { formatDate } from '@/shared/presentation/utils/format-date'

export const useDashboard = () => {
  const filters = ref<IDashboardFilters>({})
  const query = useDashboardQuery(filters)

  const isEmpty = computed(() => !!query.data.value && !query.data.value.hasMovimientos())

  const errorMessage = computed(() =>
    query.error.value instanceof DomainError
      ? query.error.value.message
      : 'No pudimos cargar el resumen. Inténtalo de nuevo.',
  )

  const saldoLabel = computed(() =>
    query.data.value?.hasPeriodo() ? 'Saldo del período' : 'Saldo total',
  )

  const periodLabel = computed(() => {
    const { startDate, endDate } = query.data.value?.periodo ?? {}

    if (startDate && endDate) return `Del ${formatDate(startDate)} al ${formatDate(endDate)}`
    if (startDate) return `Desde el ${formatDate(startDate)}`
    if (endDate) return `Hasta el ${formatDate(endDate)}`
    return 'Todo el historial'
  })

  return {
    filters,
    summary: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    isEmpty,
    errorMessage,
    saldoLabel,
    periodLabel,
    refetch: query.refetch,
  }
}

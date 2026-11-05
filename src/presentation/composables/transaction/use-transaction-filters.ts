import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ITransactionFilters, TransactionType } from '@/domain/transaction/dto'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 300

type FilterKey = 'categoryId' | 'startDate' | 'endDate'

const first = (value: unknown) =>
  (Array.isArray(value) ? value[0] : value) as string | null | undefined

/**
 * Los filtros viven en la URL: sobreviven a una recarga, se pueden compartir y siguen ahí al
 * volver de editar una transacción.
 */
export const useTransactionFilters = () => {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<ITransactionFilters>(() => {
    const { type, categoryId, startDate, endDate, search, page } = route.query
    const rawType = first(type)
    const parsedPage = Number(first(page))

    return {
      type: rawType === 'entrada' || rawType === 'saida' ? rawType : undefined,
      categoryId: first(categoryId) || undefined,
      startDate: first(startDate) || undefined,
      endDate: first(endDate) || undefined,
      search: first(search) || undefined,
      page: Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1,
      limit: PAGE_SIZE,
    }
  })

  const applyQuery = (patch: Record<string, string | undefined>) => {
    const entries = Object.entries({ ...route.query, ...patch }).filter(([, value]) => !!value)
    return router.replace({ query: Object.fromEntries(entries) as Record<string, string> })
  }

  /** Cambiar un filtro siempre vuelve a la primera página. */
  const setFilters = (patch: Record<string, string | undefined>) =>
    applyQuery({ ...patch, page: undefined })

  const setPage = (page: number) => applyQuery({ page: page > 1 ? String(page) : undefined })

  const clearFilters = () => router.replace({ query: {} })

  const filterModel = (key: FilterKey) =>
    computed({
      get: () => filters.value[key] ?? '',
      set: (value) => setFilters({ [key]: value }),
    })

  const type = computed({
    get: () => filters.value.type ?? '',
    set: (value: TransactionType | '') => setFilters({ type: value || undefined }),
  })

  // El texto se escribe al momento, pero la URL (y la consulta) cambia al dejar de teclear.
  const search = ref(filters.value.search ?? '')

  watch(search, (value, _previous, onCleanup) => {
    if (value === (filters.value.search ?? '')) return

    const timer = setTimeout(() => setFilters({ search: value }), SEARCH_DEBOUNCE_MS)
    onCleanup(() => clearTimeout(timer))
  })

  watch(
    () => filters.value.search,
    (value) => {
      search.value = value ?? ''
    },
  )

  const hasActiveFilters = computed(() => {
    const { page: _page, limit: _limit, ...active } = filters.value
    return Object.values(active).some(Boolean)
  })

  return {
    filters,
    type,
    categoryId: filterModel('categoryId'),
    startDate: filterModel('startDate'),
    endDate: filterModel('endDate'),
    search,
    hasActiveFilters,
    setPage,
    clearFilters,
  }
}

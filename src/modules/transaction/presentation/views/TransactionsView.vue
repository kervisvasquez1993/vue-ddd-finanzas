<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { TransactionEntity } from '@/modules/transaction/domain/entities'
import AsyncGuard from '@/shared/presentation/components/AsyncGuard.vue'
import BaseButton from '@/shared/presentation/components/BaseButton.vue'
import ConfirmDialog from '@/shared/presentation/components/ConfirmDialog.vue'
import DataTable from '@/shared/presentation/components/DataTable.vue'
import type { DataTableColumn } from '@/shared/presentation/components/data-table.types'
import PaginationBar from '@/shared/presentation/components/PaginationBar.vue'
import TransactionFilters from '@/modules/transaction/presentation/components/TransactionFilters.vue'
import { transactionTypeLabels } from '@/modules/transaction/presentation/components/transaction-types'
import { useTransactionList } from '@/modules/transaction/presentation/composables/use-transaction-list'
import { formatCurrency } from '@/shared/presentation/utils/format-currency'
import { formatDate } from '@/shared/presentation/utils/format-date'

const {
  type,
  categoryId,
  startDate,
  endDate,
  search,
  hasActiveFilters,
  setPage,
  clearFilters,
  transactions,
  page,
  total,
  totalPages,
  isLoading,
  isError,
  errorMessage,
  refetch,
  transactionToDelete,
  isDeleteDialogOpen,
  isDeleting,
  askToDelete,
  confirmDelete,
} = useTransactionList()

const columns: DataTableColumn[] = [
  { key: 'date', label: 'Fecha' },
  { key: 'description', label: 'Descripción' },
  { key: 'category', label: 'Categoría' },
  { key: 'type', label: 'Tipo' },
  { key: 'amount', label: 'Monto', align: 'right' },
  { key: 'actions', label: 'Acciones', align: 'right' },
]

const currentPage = computed({ get: () => page.value, set: setPage })

const signedAmount = (transaction: TransactionEntity) =>
  `${transaction.isEntrada() ? '+' : '-'} ${formatCurrency(transaction.amount)}`
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-3">
    <h1 class="text-2xl font-semibold text-slate-900">Transacciones</h1>
    <BaseButton :as="RouterLink" :to="{ name: 'transactions-create' }">
      Nueva transacción
    </BaseButton>
  </header>

  <TransactionFilters
    v-model:type="type"
    v-model:category-id="categoryId"
    v-model:start-date="startDate"
    v-model:end-date="endDate"
    v-model:search="search"
    :can-clear="hasActiveFilters"
    @clear="clearFilters"
  />

  <AsyncGuard
    :data="transactions"
    :is-loading="isLoading"
    :is-error="isError"
    :error-message="errorMessage"
    @retry="refetch()"
  >
    <template #empty>
      <p class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        {{
          hasActiveFilters
            ? 'No hay transacciones con estos filtros.'
            : 'Todavía no tienes transacciones.'
        }}
      </p>
    </template>

    <template #default="{ data }">
      <DataTable :rows="data" :columns="columns" :row-key="(transaction) => transaction.id">
        <template #cell-date="{ row }">{{ formatDate(row.date) }}</template>
        <template #cell-category="{ row }">{{ row.categoryName ?? '—' }}</template>
        <template #cell-type="{ row }">{{ transactionTypeLabels[row.type] }}</template>
        <template #cell-amount="{ row }">
          <span :class="row.isEntrada() ? 'text-emerald-700' : 'text-red-700'">
            {{ signedAmount(row) }}
          </span>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end gap-3">
            <RouterLink
              class="font-medium text-slate-900 underline"
              :to="{ name: 'transactions-edit', params: { id: row.id } }"
            >
              Editar
            </RouterLink>
            <button
              type="button"
              class="font-medium text-red-700 underline"
              @click="askToDelete(row)"
            >
              Eliminar
            </button>
          </div>
        </template>
      </DataTable>

      <PaginationBar v-model:page="currentPage" :total-pages="totalPages" :total="total" />
    </template>
  </AsyncGuard>

  <ConfirmDialog
    v-model:open="isDeleteDialogOpen"
    title="Eliminar transacción"
    confirm-label="Eliminar"
    :loading="isDeleting"
    @confirm="confirmDelete"
  >
    ¿Seguro que quieres eliminar "{{ transactionToDelete?.description }}"? Esta acción no se puede
    deshacer.
  </ConfirmDialog>
</template>

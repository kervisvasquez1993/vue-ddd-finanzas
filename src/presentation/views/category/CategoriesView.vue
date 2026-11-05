<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppLayout from '@/presentation/components/shared/AppLayout.vue'
import AsyncGuard from '@/presentation/components/shared/AsyncGuard.vue'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import ConfirmDialog from '@/presentation/components/shared/ConfirmDialog.vue'
import DataTable from '@/presentation/components/shared/DataTable.vue'
import type { DataTableColumn } from '@/presentation/components/shared/data-table.types'
import { useCategoryList } from '@/presentation/composables/category/use-category-list'
import { formatCurrency } from '@/presentation/utils/format-currency'

const {
  categories,
  isLoading,
  isError,
  errorMessage,
  refetch,
  categoryToDelete,
  isDeleteDialogOpen,
  isDeleting,
  askToDelete,
  confirmDelete,
} = useCategoryList()

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Categoría' },
  { key: 'transactionsCount', label: 'Transacciones', align: 'right' },
  { key: 'totalEntradas', label: 'Entradas', align: 'right' },
  { key: 'totalSaidas', label: 'Salidas', align: 'right' },
  { key: 'actions', label: 'Acciones', align: 'right' },
]
</script>

<template>
  <AppLayout>
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Categorías</h1>
        <p class="text-sm text-slate-600">Los totales incluyen todo el historial.</p>
      </div>
      <BaseButton :as="RouterLink" :to="{ name: 'categories-create' }">Nueva categoría</BaseButton>
    </header>

    <AsyncGuard
      :data="categories"
      :is-loading="isLoading"
      :is-error="isError"
      :error-message="errorMessage"
      @retry="refetch()"
    >
      <template #empty>
        <p class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          Todavía no tienes categorías.
        </p>
      </template>

      <template #default="{ data }">
        <DataTable :rows="data" :columns="columns" :row-key="(category) => category.id">
          <template #cell-name="{ row }">
            <p class="font-medium">{{ row.name }}</p>
            <p v-if="row.description" class="text-xs text-slate-500">{{ row.description }}</p>
          </template>
          <template #cell-totalEntradas="{ row }">{{ formatCurrency(row.totalEntradas) }}</template>
          <template #cell-totalSaidas="{ row }">{{ formatCurrency(row.totalSaidas) }}</template>
          <template #cell-actions="{ row }">
            <div class="flex justify-end gap-3">
              <RouterLink
                class="font-medium text-slate-900 underline"
                :to="{ name: 'categories-edit', params: { id: row.id } }"
              >
                Editar
              </RouterLink>
              <button
                type="button"
                class="font-medium text-red-700 underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
                :disabled="!row.canBeDeleted()"
                :title="row.canBeDeleted() ? undefined : 'Tiene transacciones asociadas'"
                @click="askToDelete(row)"
              >
                Eliminar
              </button>
            </div>
          </template>
        </DataTable>
      </template>
    </AsyncGuard>

    <ConfirmDialog
      v-model:open="isDeleteDialogOpen"
      title="Eliminar categoría"
      confirm-label="Eliminar"
      :loading="isDeleting"
      @confirm="confirmDelete"
    >
      ¿Seguro que quieres eliminar "{{ categoryToDelete?.name }}"? Esta acción no se puede deshacer.
    </ConfirmDialog>
  </AppLayout>
</template>

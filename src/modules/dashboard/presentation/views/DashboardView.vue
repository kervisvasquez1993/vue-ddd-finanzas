<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DashboardSkeleton from '@/modules/dashboard/presentation/components/DashboardSkeleton.vue'
import PeriodFilter from '@/modules/dashboard/presentation/components/PeriodFilter.vue'
import SummaryCard from '@/modules/dashboard/presentation/components/SummaryCard.vue'
import TopCategoriesChart from '@/modules/dashboard/presentation/components/TopCategoriesChart.vue'
import AsyncGuard from '@/shared/presentation/components/AsyncGuard.vue'
import BaseButton from '@/shared/presentation/components/BaseButton.vue'
import { useDashboard } from '@/modules/dashboard/presentation/composables/use-dashboard'
import { formatCurrency } from '@/shared/presentation/utils/format-currency'

const {
  filters,
  summary,
  isLoading,
  isError,
  isFetching,
  isEmpty,
  errorMessage,
  saldoLabel,
  periodLabel,
  refetch,
} = useDashboard()
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-3">
    <h1 class="text-2xl font-semibold text-slate-900">Resumen</h1>
    <BaseButton :as="RouterLink" :to="{ name: 'transactions-create' }">
      Nueva transacción
    </BaseButton>
  </header>

  <PeriodFilter v-model="filters" :loading="isFetching" />

  <AsyncGuard
    :data="summary"
    :is-loading="isLoading"
    :is-error="isError"
    :is-empty="isEmpty"
    :error-message="errorMessage"
    @retry="refetch()"
  >
    <template #loading><DashboardSkeleton /></template>

    <template #empty>
      <p class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        No hay movimientos. {{ periodLabel }}.
      </p>
    </template>

    <template #default="{ data }">
      <div class="grid gap-4 sm:grid-cols-3">
        <SummaryCard :label="saldoLabel" :value="formatCurrency(data.saldoAtual)">
          {{ periodLabel }}
        </SummaryCard>
        <SummaryCard label="Total de entradas" :value="formatCurrency(data.totalEntradas)" />
        <SummaryCard label="Total de salidas" :value="formatCurrency(data.totalSaidas)" />
      </div>

      <TopCategoriesChart :categories="data.topCategoriasSaidas" :period="data.periodo" />
    </template>
  </AsyncGuard>
</template>

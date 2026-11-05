<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DashboardSkeleton from '@/presentation/components/dashboard/DashboardSkeleton.vue'
import PeriodFilter from '@/presentation/components/dashboard/PeriodFilter.vue'
import SummaryCard from '@/presentation/components/dashboard/SummaryCard.vue'
import TopCategoriesChart from '@/presentation/components/dashboard/TopCategoriesChart.vue'
import AppLayout from '@/presentation/components/shared/AppLayout.vue'
import AsyncGuard from '@/presentation/components/shared/AsyncGuard.vue'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import { useDashboard } from '@/presentation/composables/dashboard/use-dashboard'
import { formatCurrency } from '@/presentation/utils/format-currency'

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
  <AppLayout>
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
  </AppLayout>
</template>

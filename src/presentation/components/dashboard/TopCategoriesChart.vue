<script setup lang="ts">
import { computed } from 'vue'
import type { TopCategoriaSaida } from '@/domain/dashboard/entities'
import { formatCurrency } from '@/presentation/utils/format-currency'

const props = defineProps<{ categories: TopCategoriaSaida[] }>()

const maxTotal = computed(() => Math.max(...props.categories.map(({ total }) => total), 0))
const barWidth = (total: number) => (maxTotal.value > 0 ? `${(total / maxTotal.value) * 100}%` : 0)
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5">
    <h2 class="mb-4 font-semibold text-slate-900">Categorías con más salidas</h2>

    <ol v-if="categories.length" class="flex flex-col gap-4">
      <li v-for="category in categories" :key="category.categoryId" class="flex flex-col gap-1.5">
        <div class="flex items-baseline justify-between gap-3 text-sm">
          <span class="font-medium text-slate-900">{{ category.categoryName }}</span>
          <span class="text-slate-600 tabular-nums">{{ formatCurrency(category.total) }}</span>
        </div>
        <div class="h-2 rounded-r bg-blue-600" :style="{ width: barWidth(category.total) }" />
      </li>
    </ol>

    <p v-else class="text-sm text-slate-600">No hay salidas en este período.</p>
  </section>
</template>

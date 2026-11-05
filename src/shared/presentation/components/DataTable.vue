<script setup lang="ts" generic="T">
import type { DataTableColumn } from './data-table.types'

defineProps<{
  rows: T[]
  columns: DataTableColumn[]
  rowKey: (row: T) => string
}>()

defineSlots<{
  [K in `cell-${string}`]: (props: { row: T }) => unknown
}>()

const cellValue = (row: T, key: string) => (row as Record<string, unknown>)[key]
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table class="w-full text-sm">
      <thead class="border-b border-slate-200 text-slate-600">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-4 py-3 font-medium"
            :class="column.align === 'right' ? 'text-right' : 'text-left'"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-for="row in rows" :key="rowKey(row)">
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-slate-900"
            :class="{ 'text-right tabular-nums': column.align === 'right' }"
          >
            <slot :name="`cell-${column.key}`" :row="row">
              {{ cellValue(row, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

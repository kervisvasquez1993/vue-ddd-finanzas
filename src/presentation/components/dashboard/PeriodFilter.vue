<script setup lang="ts">
import type { IDashboardFilters } from '@/domain/dashboard/dto'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import FormField from '@/presentation/components/shared/FormField.vue'
import { usePeriodFilterForm } from '@/presentation/composables/dashboard/use-period-filter-form'

const filters = defineModel<IDashboardFilters>({ required: true })
defineProps<{ loading?: boolean }>()

const { startDate, startDateAttrs, endDate, endDateAttrs, errors, onSubmit, clear } =
  usePeriodFilterForm(filters)
</script>

<template>
  <form class="flex flex-wrap items-start gap-3" novalidate @submit="onSubmit">
    <FormField
      v-model="startDate"
      v-bind="startDateAttrs"
      label="Desde"
      type="date"
      :error="errors.startDate"
    />
    <FormField
      v-model="endDate"
      v-bind="endDateAttrs"
      label="Hasta"
      type="date"
      :error="errors.endDate"
    />
    <div class="flex gap-2 sm:mt-6">
      <BaseButton type="submit" :loading="loading">Aplicar</BaseButton>
      <button
        type="button"
        class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        @click="clear"
      >
        Limpiar
      </button>
    </div>
  </form>
</template>

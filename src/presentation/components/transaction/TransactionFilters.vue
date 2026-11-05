<script setup lang="ts">
import { computed } from 'vue'
import FormField from '@/presentation/components/shared/FormField.vue'
import FormSelect from '@/presentation/components/shared/FormSelect.vue'
import { useCategoriesQuery } from '@/presentation/queries/category'
import { transactionTypeOptions } from './transaction-types'

const type = defineModel<string>('type')
const categoryId = defineModel<string>('categoryId')
const startDate = defineModel<string>('startDate')
const endDate = defineModel<string>('endDate')
const search = defineModel<string>('search')

defineProps<{ canClear: boolean }>()
const emit = defineEmits<{ clear: [] }>()

const { data: categories } = useCategoriesQuery()
const categoryOptions = computed(() =>
  (categories.value ?? []).map(({ id, name }) => ({ value: id, label: name })),
)
</script>

<template>
  <section
    class="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-5"
    aria-label="Filtros de transacciones"
  >
    <FormField v-model="search" label="Buscar" type="search" placeholder="Descripción" />
    <FormSelect v-model="type" label="Tipo" placeholder="Todos" :options="transactionTypeOptions" />
    <FormSelect
      v-model="categoryId"
      label="Categoría"
      placeholder="Todas"
      :options="categoryOptions"
    />
    <FormField v-model="startDate" label="Desde" type="date" />
    <FormField v-model="endDate" label="Hasta" type="date" />
    <button
      v-if="canClear"
      type="button"
      class="justify-self-start text-sm font-medium text-slate-700 underline"
      @click="emit('clear')"
    >
      Limpiar filtros
    </button>
  </section>
</template>

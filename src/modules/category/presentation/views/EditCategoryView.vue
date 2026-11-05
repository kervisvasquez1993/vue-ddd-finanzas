<script setup lang="ts">
import { computed } from 'vue'
import { DomainError } from '@/shared/domain/errors'
import CategoryForm from '@/modules/category/presentation/components/CategoryForm.vue'
import AsyncGuard from '@/shared/presentation/components/AsyncGuard.vue'
import { useCategoryQuery } from '@/modules/category/presentation/queries'

const props = defineProps<{ id: string }>()

const { data, isLoading, isError, error, refetch } = useCategoryQuery(() => props.id)

const errorMessage = computed(() =>
  error.value instanceof DomainError ? error.value.message : 'No pudimos cargar la categoría.',
)
</script>

<template>
  <h1 class="text-2xl font-semibold text-slate-900">Editar categoría</h1>

  <AsyncGuard
    :data="data"
    :is-loading="isLoading"
    :is-error="isError"
    :error-message="errorMessage"
    @retry="refetch()"
  >
    <template #default="{ data: category }">
      <CategoryForm :key="category.id" :category="category" submit-label="Guardar cambios" />
    </template>
  </AsyncGuard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DomainError } from '@/domain/shared/errors'
import CategoryForm from '@/presentation/components/category/CategoryForm.vue'
import AppLayout from '@/presentation/components/shared/AppLayout.vue'
import AsyncGuard from '@/presentation/components/shared/AsyncGuard.vue'
import { useCategoryQuery } from '@/presentation/queries/category'

const props = defineProps<{ id: string }>()

const { data, isLoading, isError, error, refetch } = useCategoryQuery(() => props.id)

const errorMessage = computed(() =>
  error.value instanceof DomainError ? error.value.message : 'No pudimos cargar la categoría.',
)
</script>

<template>
  <AppLayout>
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
  </AppLayout>
</template>

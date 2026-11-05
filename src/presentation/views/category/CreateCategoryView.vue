<script setup lang="ts">
import CategoryForm from '@/presentation/components/category/CategoryForm.vue'
import AppLayout from '@/presentation/components/shared/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <h1 class="text-2xl font-semibold text-slate-900">Nueva categoría</h1>
    <CategoryForm submit-label="Crear categoría" />
  </AppLayout>
</template>

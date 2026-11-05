<script setup lang="ts">
const page = defineModel<number>('page', { required: true })
defineProps<{ totalPages: number; total: number }>()
</script>

<template>
  <nav class="flex items-center justify-between gap-3 text-sm" aria-label="Paginación">
    <p class="text-slate-600">{{ total }} resultados · Página {{ page }} de {{ totalPages }}</p>
    <div class="flex gap-2">
      <button
        type="button"
        class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="page <= 1"
        @click="page -= 1"
      >
        Anterior
      </button>
      <button
        type="button"
        class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="page >= totalPages"
        @click="page += 1"
      >
        Siguiente
      </button>
    </div>
  </nav>
</template>

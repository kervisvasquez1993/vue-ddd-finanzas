<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>

<template>
  <article class="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-5">
    <h2 class="text-sm text-slate-600">{{ label }}</h2>
    <p class="text-2xl font-semibold text-slate-900 tabular-nums">{{ value }}</p>
    <p v-if="$slots.default" class="text-xs text-slate-500"><slot /></p>
  </article>
</template>

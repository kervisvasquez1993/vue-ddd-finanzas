<script setup lang="ts">
defineProps<{ loading?: boolean; disabled?: boolean }>()
</script>

<template>
  <button
    class="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="loading || disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(defineProps<{ as?: string | Component; loading?: boolean; disabled?: boolean }>(), {
  as: 'button',
})
</script>

<template>
  <component
    :is="as"
    class="inline-block rounded-lg bg-slate-900 px-4 py-2 text-center font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="loading || disabled"
  >
    <slot />
  </component>
</template>

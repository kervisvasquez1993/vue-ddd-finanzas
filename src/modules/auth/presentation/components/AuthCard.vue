<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <section class="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-8 shadow">
      <h1 class="text-2xl font-semibold text-slate-900">{{ title }}</h1>
      <slot />
      <footer v-if="$slots.footer" class="text-center text-sm text-slate-600">
        <slot name="footer" />
      </footer>
    </section>
  </main>
</template>

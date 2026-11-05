<template>
  <div class="flex animate-pulse flex-col gap-6" aria-busy="true" aria-label="Cargando resumen">
    <div class="grid gap-4 sm:grid-cols-3">
      <div v-for="card in 3" :key="card" class="h-28 rounded-xl bg-slate-200" />
    </div>
    <div class="h-56 rounded-xl bg-slate-200" />
  </div>
</template>

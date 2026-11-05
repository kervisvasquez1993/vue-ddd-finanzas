<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import { useLogout } from '@/presentation/composables/auth/use-logout'
import { useAuthStore } from '@/presentation/stores/auth.store'

const { user } = storeToRefs(useAuthStore())
const logout = useLogout()

const links = [
  { name: 'dashboard', label: 'Resumen' },
  { name: 'transactions', label: 'Transacciones' },
  { name: 'categories', label: 'Categorías' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <nav class="flex items-center gap-4" aria-label="Principal">
          <RouterLink
            v-for="link in links"
            :key="link.name"
            class="text-sm font-medium text-slate-600 hover:text-slate-900"
            active-class="text-slate-900 underline"
            :to="{ name: link.name }"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <p class="ml-auto font-medium text-slate-900">Hola, {{ user?.name }}</p>
        <BaseButton type="button" @click="logout">Cerrar sesión</BaseButton>
      </div>
    </header>
    <main class="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      <slot />
    </main>
  </div>
</template>

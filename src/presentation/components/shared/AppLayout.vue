<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import { useLogout } from '@/presentation/composables/auth/use-logout'
import { useAuthStore } from '@/presentation/stores/auth.store'

const { user } = storeToRefs(useAuthStore())
const logout = useLogout()
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <p class="font-medium text-slate-900">Hola, {{ user?.name }}</p>
        <BaseButton type="button" @click="logout">Cerrar sesión</BaseButton>
      </div>
    </header>
    <main class="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import { useLogout } from '@/presentation/composables/auth/use-logout'
import { useAuthStore } from '@/presentation/stores/auth.store'

const { user } = storeToRefs(useAuthStore())
const logout = useLogout()
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100">
    <h1 class="text-2xl font-semibold text-slate-900">Hola, {{ user?.name }}</h1>
    <BaseButton type="button" @click="logout">Cerrar sesión</BaseButton>
  </main>
</template>

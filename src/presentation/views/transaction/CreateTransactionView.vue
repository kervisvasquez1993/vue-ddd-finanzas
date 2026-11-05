<script setup lang="ts">
import AppLayout from '@/presentation/components/shared/AppLayout.vue'
import TransactionForm from '@/presentation/components/transaction/TransactionForm.vue'
</script>

<template>
  <AppLayout>
    <h1 class="text-2xl font-semibold text-slate-900">Nueva transacción</h1>
    <TransactionForm submit-label="Crear transacción" />
  </AppLayout>
</template>

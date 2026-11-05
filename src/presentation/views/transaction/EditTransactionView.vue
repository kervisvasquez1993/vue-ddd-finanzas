<script setup lang="ts">
import { computed } from 'vue'
import { DomainError } from '@/domain/shared/errors'
import AppLayout from '@/presentation/components/shared/AppLayout.vue'
import AsyncGuard from '@/presentation/components/shared/AsyncGuard.vue'
import TransactionForm from '@/presentation/components/transaction/TransactionForm.vue'
import { useTransactionQuery } from '@/presentation/queries/transaction'

const props = defineProps<{ id: string }>()

const { data, isLoading, isError, error, refetch } = useTransactionQuery(() => props.id)

const errorMessage = computed(() =>
  error.value instanceof DomainError ? error.value.message : 'No pudimos cargar la transacción.',
)
</script>

<template>
  <AppLayout>
    <h1 class="text-2xl font-semibold text-slate-900">Editar transacción</h1>

    <AsyncGuard
      :data="data"
      :is-loading="isLoading"
      :is-error="isError"
      :error-message="errorMessage"
      @retry="refetch()"
    >
      <template #default="{ data: transaction }">
        <TransactionForm
          :key="transaction.id"
          :transaction="transaction"
          submit-label="Guardar cambios"
        />
      </template>
    </AsyncGuard>
  </AppLayout>
</template>

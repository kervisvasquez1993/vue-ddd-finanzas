<script setup lang="ts">
import { computed } from 'vue'
import { DomainError } from '@/shared/domain/errors'
import AsyncGuard from '@/shared/presentation/components/AsyncGuard.vue'
import TransactionForm from '@/modules/transaction/presentation/components/TransactionForm.vue'
import { useTransactionQuery } from '@/modules/transaction/presentation/queries'

const props = defineProps<{ id: string }>()

const { data, isLoading, isError, error, refetch } = useTransactionQuery(() => props.id)

const errorMessage = computed(() =>
  error.value instanceof DomainError ? error.value.message : 'No pudimos cargar la transacción.',
)
</script>

<template>
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
</template>

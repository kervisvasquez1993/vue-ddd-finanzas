<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { TransactionEntity } from '@/domain/transaction/entities'
import BaseButton from '@/presentation/components/shared/BaseButton.vue'
import FormAlert from '@/presentation/components/shared/FormAlert.vue'
import FormField from '@/presentation/components/shared/FormField.vue'
import FormSelect from '@/presentation/components/shared/FormSelect.vue'
import { useTransactionForm } from '@/presentation/composables/transaction/use-transaction-form'
import { transactionTypeOptions } from './transaction-types'

const props = defineProps<{ transaction?: TransactionEntity; submitLabel: string }>()

const {
  description,
  descriptionAttrs,
  amount,
  amountAttrs,
  type,
  typeAttrs,
  date,
  dateAttrs,
  categoryId,
  categoryIdAttrs,
  categoryOptions,
  hasNoCategories,
  errors,
  formErrors,
  isPending,
  onSubmit,
} = useTransactionForm(props.transaction)
</script>

<template>
  <p
    v-if="hasNoCategories"
    class="max-w-lg rounded-xl border border-slate-200 bg-white p-6 text-slate-600"
  >
    Para registrar una transacción necesitas una categoría.
    <RouterLink class="font-medium text-slate-900 underline" :to="{ name: 'categories-create' }">
      Crear categoría
    </RouterLink>
  </p>

  <form
    v-else
    class="flex max-w-lg flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6"
    novalidate
    @submit="onSubmit"
  >
    <FormAlert :messages="formErrors" />
    <FormField
      v-model="description"
      v-bind="descriptionAttrs"
      label="Descripción"
      :error="errors.description"
    />
    <FormField
      v-model="amount"
      v-bind="amountAttrs"
      label="Monto"
      type="number"
      step="0.01"
      min="0.01"
      inputmode="decimal"
      :error="errors.amount"
    />
    <FormSelect
      v-model="type"
      v-bind="typeAttrs"
      label="Tipo"
      :options="transactionTypeOptions"
      :error="errors.type"
    />
    <FormField v-model="date" v-bind="dateAttrs" label="Fecha" type="date" :error="errors.date" />
    <div class="flex flex-col gap-1">
      <FormSelect
        v-model="categoryId"
        v-bind="categoryIdAttrs"
        label="Categoría"
        placeholder="Elige una categoría"
        :options="categoryOptions"
        :disabled="!!transaction"
        :error="errors.categoryId"
      />
      <small v-if="transaction" class="text-slate-500">
        La categoría no se puede cambiar. Si te equivocaste, elimina la transacción y créala de
        nuevo.
      </small>
    </div>
    <div class="flex justify-end gap-2">
      <RouterLink
        class="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
        :to="{ name: 'transactions' }"
      >
        Cancelar
      </RouterLink>
      <BaseButton type="submit" :loading="isPending">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>

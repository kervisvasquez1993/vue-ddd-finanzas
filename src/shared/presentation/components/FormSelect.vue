<script setup lang="ts">
import { useFieldAttrs } from '@/shared/presentation/composables/use-field-attrs'
import type { SelectOption } from './form.types'

defineOptions({ inheritAttrs: false })
defineProps<{
  label: string
  options: SelectOption[]
  placeholder?: string
  error?: string
}>()

const model = defineModel<string>()
const { rootAttrs, controlAttrs } = useFieldAttrs()
</script>

<template>
  <label class="flex flex-col gap-1 text-sm" v-bind="rootAttrs">
    <span class="font-medium text-slate-700">{{ label }}</span>
    <select
      v-model="model"
      v-bind="controlAttrs"
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
      :class="{ 'border-red-500': error }"
      :aria-invalid="!!error"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <small v-if="error" class="text-red-600">{{ error }}</small>
  </label>
</template>

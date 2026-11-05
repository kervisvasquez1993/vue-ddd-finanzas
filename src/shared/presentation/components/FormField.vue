<script setup lang="ts">
import { useFieldAttrs } from '@/shared/presentation/composables/use-field-attrs'

defineOptions({ inheritAttrs: false })
defineProps<{ label: string; error?: string }>()

const model = defineModel<string | number>()
const { rootAttrs, controlAttrs } = useFieldAttrs()
</script>

<template>
  <label class="flex flex-col gap-1 text-sm" v-bind="rootAttrs">
    <span class="font-medium text-slate-700">{{ label }}</span>
    <span class="flex items-center gap-2">
      <input
        v-model="model"
        v-bind="controlAttrs"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        :class="{ 'border-red-500': error }"
        :aria-invalid="!!error"
      />
      <slot name="trailing" />
    </span>
    <small v-if="error" class="text-red-600">{{ error }}</small>
  </label>
</template>

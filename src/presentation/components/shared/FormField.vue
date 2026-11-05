<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
defineProps<{ label: string; error?: string }>()

const model = defineModel<string>()

// class/style van al wrapper; el resto (type, autocomplete, onBlur...) al input.
const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const inputAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')),
)
</script>

<template>
  <label class="flex flex-col gap-1 text-sm" v-bind="rootAttrs">
    <span class="font-medium text-slate-700">{{ label }}</span>
    <span class="flex items-center gap-2">
      <input
        v-model="model"
        v-bind="inputAttrs"
        class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        :class="{ 'border-red-500': error }"
        :aria-invalid="!!error"
      />
      <slot name="trailing" />
    </span>
    <small v-if="error" class="text-red-600">{{ error }}</small>
  </label>
</template>

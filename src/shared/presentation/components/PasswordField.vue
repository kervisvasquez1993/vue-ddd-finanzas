<script setup lang="ts">
import { ref } from 'vue'
import FormField from './FormField.vue'

defineProps<{ label: string; error?: string }>()

const model = defineModel<string | number>()
const isVisible = ref(false)
</script>

<template>
  <FormField v-model="model" :label="label" :error="error" :type="isVisible ? 'text' : 'password'">
    <template #trailing>
      <button
        type="button"
        class="text-xs font-medium text-slate-600 hover:text-slate-900"
        @click="isVisible = !isVisible"
      >
        {{ isVisible ? 'Ocultar' : 'Mostrar' }}
      </button>
    </template>
  </FormField>
</template>

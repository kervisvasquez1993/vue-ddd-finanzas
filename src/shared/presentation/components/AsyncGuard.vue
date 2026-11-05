<script setup lang="ts" generic="T">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data: T | null | undefined
    isLoading: boolean
    isError: boolean
    isEmpty?: boolean
    errorMessage?: string
  }>(),
  { isEmpty: undefined, errorMessage: 'Error inesperado' },
)

const emit = defineEmits<{ retry: [] }>()

defineSlots<{
  loading?(): unknown
  error?(props: { message: string; retry: () => void }): unknown
  empty?(): unknown
  default(props: { data: NonNullable<T> }): unknown
}>()

const hasData = computed(() =>
  Array.isArray(props.data) ? props.data.length > 0 : props.data != null,
)
const showEmpty = computed(() => props.isEmpty ?? !hasData.value)
const retry = () => emit('retry')
</script>

<template>
  <slot v-if="isLoading" name="loading">
    <p class="p-4 text-center text-slate-500">Cargando...</p>
  </slot>

  <slot v-else-if="isError" name="error" :message="errorMessage" :retry="retry">
    <div role="alert" class="p-4 text-center text-red-700">
      <p>{{ errorMessage }}</p>
      <button type="button" class="mt-2 font-medium underline" @click="retry">Reintentar</button>
    </div>
  </slot>

  <slot v-else-if="showEmpty" name="empty">
    <p class="p-4 text-center text-slate-500">Sin resultados</p>
  </slot>

  <slot v-else :data="data as NonNullable<T>" />
</template>

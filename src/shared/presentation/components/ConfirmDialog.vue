<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'

defineProps<{ title: string; confirmLabel: string; loading?: boolean }>()
const emit = defineEmits<{ confirm: [] }>()

const isOpen = defineModel<boolean>('open', { required: true })
const cancelButton = ref<HTMLButtonElement>()

const close = () => {
  isOpen.value = false
}

// El botón solo existe tras renderizar, por eso nextTick. Cancelar es la opción segura.
watch(isOpen, async (open) => {
  if (!open) return
  await nextTick()
  cancelButton.value?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="close"
      @keydown.esc="close"
    >
      <section
        role="alertdialog"
        aria-modal="true"
        :aria-label="title"
        class="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow"
      >
        <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
        <div class="text-sm text-slate-600"><slot /></div>
        <footer class="flex justify-end gap-2">
          <button
            ref="cancelButton"
            type="button"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            @click="close"
          >
            Cancelar
          </button>
          <BaseButton type="button" :loading="loading" @click="emit('confirm')">
            {{ confirmLabel }}
          </BaseButton>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

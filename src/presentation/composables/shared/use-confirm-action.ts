import { computed, shallowRef } from 'vue'

/** Guarda sobre qué elemento se pidió confirmación, para usarlo con ConfirmDialog. */
export const useConfirmAction = <T>() => {
  const target = shallowRef<T | null>(null)

  // computed con get y set: se puede usar con v-model aunque el estado real sea el elemento.
  const isOpen = computed({
    get: () => target.value !== null,
    set: (open) => {
      if (!open) target.value = null
    },
  })

  const ask = (item: T) => {
    target.value = item
  }

  const close = () => {
    target.value = null
  }

  return { target, isOpen, ask, close }
}

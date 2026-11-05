import { computed, useAttrs } from 'vue'

/** Reparte los attrs de un campo: class/style al wrapper y el resto al control interno. */
export const useFieldAttrs = () => {
  const attrs = useAttrs()

  const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
  const controlAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')),
  )

  return { rootAttrs, controlAttrs }
}

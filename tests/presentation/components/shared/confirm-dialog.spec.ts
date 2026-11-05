import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ConfirmDialog from '@/presentation/components/shared/ConfirmDialog.vue'

const render = (open: boolean) =>
  mount(ConfirmDialog, {
    props: { open, title: 'Eliminar', confirmLabel: 'Sí, eliminar' },
    slots: { default: '¿Seguro?' },
    global: { stubs: { teleport: true } },
  })

describe('ConfirmDialog', () => {
  it('no se muestra cerrado', () => {
    expect(render(false).find('[role="alertdialog"]').exists()).toBe(false)
  })

  it('emite confirm sin cerrarse por su cuenta', async () => {
    const wrapper = render(true)

    await wrapper.findAll('button')[1]?.trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('Cancelar cierra', async () => {
    const wrapper = render(true)

    await wrapper.findAll('button')[0]?.trigger('click')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('Escape cierra', async () => {
    const wrapper = render(true)

    await wrapper.find('section').trigger('keydown.esc')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AsyncGuard from '@/presentation/components/shared/AsyncGuard.vue'

const slots = {
  loading: '<p>cargando</p>',
  empty: '<p>vacio</p>',
  default: '<p>contenido</p>',
}
const base = { data: { id: 1 }, isLoading: false, isError: false }
const render = (props: object) => mount(AsyncGuard, { props: { ...base, ...props }, slots }).text()

describe('AsyncGuard', () => {
  it.each([
    ['loading', { data: undefined, isLoading: true }, 'cargando'],
    ['objeto', {}, 'contenido'],
    ['lista con datos', { data: [1] }, 'contenido'],
    ['lista vacía', { data: [] }, 'vacio'],
    ['sin datos', { data: null }, 'vacio'],
    ['isEmpty explícito', { isEmpty: true }, 'vacio'],
    ['isEmpty false gana sobre datos vacíos', { data: [], isEmpty: false }, 'contenido'],
  ])('%s', (_, props, expected) => {
    expect(render(props)).toBe(expected)
  })

  it('el error muestra el mensaje y emite retry', async () => {
    const wrapper = mount(AsyncGuard, {
      props: { ...base, isError: true, errorMessage: 'falló' },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('falló')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})

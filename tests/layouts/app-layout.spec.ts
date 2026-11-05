import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuthStore } from '@/modules/auth'
import { UserEntity } from '@/modules/auth/domain/entities'
import { Email } from '@/shared/domain/value-objects'

const page = (text: string) => ({ template: `<p>${text}</p>` })

const mountLayout = async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore().setSession({
    accessToken: 'jwt',
    user: new UserEntity({ id: 'u1', name: 'Ana', email: Email.create('ana@test.com') }),
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        component: AppLayout,
        children: [
          { path: '', name: 'dashboard', component: page('contenido del resumen') },
          { path: 'transactions', name: 'transactions', component: page('') },
          { path: 'categories', name: 'categories', component: page('') },
        ],
      },
      { path: '/login', name: 'login', component: page('') },
    ],
  })
  await router.push('/')
  const wrapper = mount(
    { template: '<RouterView />' },
    { global: { plugins: [pinia, router, [VueQueryPlugin, { queryClient: new QueryClient() }]] } },
  )
  await flushPromises()
  return { wrapper, router }
}

describe('AppLayout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra el menú, el usuario y la pantalla de la ruta hija', async () => {
    const { wrapper } = await mountLayout()

    expect(wrapper.text()).toContain('Hola, Ana')
    expect(wrapper.text()).toContain('Transacciones')
    expect(wrapper.text()).toContain('contenido del resumen')
  })

  it('cerrar sesión limpia la sesión y va a login', async () => {
    const { wrapper, router } = await mountLayout()

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(useAuthStore().isAuthenticated).toBe(false)
    expect(router.currentRoute.value.name).toBe('login')
  })
})

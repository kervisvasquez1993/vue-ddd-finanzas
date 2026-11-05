import { VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { loginUseCase, registerUseCase } from '@/modules/auth/di'
import { UserEntity } from '@/modules/auth/domain/entities'
import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '@/modules/auth/domain/errors'
import { ServiceUnavailableError } from '@/shared/domain/errors'
import { Email } from '@/shared/domain/value-objects'
import { useAuthStore } from '@/modules/auth/presentation/stores/auth.store'
import LoginView from '@/modules/auth/presentation/views/LoginView.vue'
import RegisterView from '@/modules/auth/presentation/views/RegisterView.vue'

vi.mock('@/modules/auth/di')
vi.mock('vue-sonner', () => ({
  toast: { success: vi.fn<(message: string) => void>(), error: vi.fn<(message: string) => void>() },
}))

const user = new UserEntity({ id: 'uuid-1', name: 'Ana', email: Email.create('ana@test.com') })
const stub = { template: '<div />' }

const mountView = async (view: Component) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: stub },
      { path: '/login', name: 'login', component: stub },
      { path: '/register', name: 'register', component: stub },
    ],
  })
  await router.push('/register')
  const wrapper = mount(view, { global: { plugins: [pinia, router, VueQueryPlugin] } })
  return { wrapper, router }
}

const submit = async (wrapper: Awaited<ReturnType<typeof mountView>>['wrapper']) => {
  await wrapper.find('form').trigger('submit')
  await new Promise((resolve) => setTimeout(resolve, 20))
  await flushPromises()
}

describe('LoginView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  it('muestra los errores de validación y no llama al caso de uso', async () => {
    const { wrapper } = await mountView(LoginView)

    await submit(wrapper)

    expect(wrapper.text()).toContain('Ingresa tu email')
    expect(wrapper.text()).toContain('Ingresa tu contraseña')
    expect(loginUseCase).not.toHaveBeenCalled()
  })

  it('guarda la sesión y navega al dashboard', async () => {
    vi.mocked(loginUseCase).mockResolvedValue({ accessToken: 'jwt', user })
    const { wrapper, router } = await mountView(LoginView)

    await wrapper.find('input[type="email"]').setValue('ana@test.com')
    await wrapper.find('input[type="password"]').setValue('123456')
    await submit(wrapper)

    expect(useAuthStore().accessToken).toBe('jwt')
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('muestra el error de credenciales en el formulario', async () => {
    vi.mocked(loginUseCase).mockRejectedValue(new InvalidCredentialsError())
    const { wrapper } = await mountView(LoginView)

    await wrapper.find('input[type="email"]').setValue('ana@test.com')
    await wrapper.find('input[type="password"]').setValue('mala')
    await submit(wrapper)

    expect(wrapper.find('[role="alert"]').text()).toBe('Email o contraseña incorrectos')
  })

  it('usa un toast para errores que no son de dominio', async () => {
    vi.mocked(loginUseCase).mockRejectedValue(new Error('Network Error'))
    const { wrapper } = await mountView(LoginView)

    await wrapper.find('input[type="email"]').setValue('ana@test.com')
    await wrapper.find('input[type="password"]').setValue('123456')
    await submit(wrapper)

    expect(toast.error).toHaveBeenCalledOnce()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('usa un toast si el servicio no está disponible', async () => {
    vi.mocked(loginUseCase).mockRejectedValue(new ServiceUnavailableError())
    const { wrapper } = await mountView(LoginView)

    await wrapper.find('input[type="email"]').setValue('ana@test.com')
    await wrapper.find('input[type="password"]').setValue('123456')
    await submit(wrapper)

    expect(toast.error).toHaveBeenCalledOnce()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('PasswordField alterna la visibilidad', async () => {
    const { wrapper } = await mountView(LoginView)

    await wrapper.find('button[type="button"]').trigger('click')

    expect(wrapper.find('input[autocomplete="current-password"]').attributes('type')).toBe('text')
  })
})

describe('RegisterView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  const fill = async (wrapper: Awaited<ReturnType<typeof mountView>>['wrapper']) => {
    await wrapper.find('input[autocomplete="name"]').setValue('Ana')
    await wrapper.find('input[type="email"]').setValue('ana@test.com')
    await wrapper.find('input[type="password"]').setValue('123456')
  }

  it('marca el campo email con el 409', async () => {
    vi.mocked(registerUseCase).mockRejectedValue(new EmailAlreadyRegisteredError())
    const { wrapper, router } = await mountView(RegisterView)

    await fill(wrapper)
    await submit(wrapper)

    expect(wrapper.find('input[type="email"]').attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('Este email ya está registrado')
    expect(router.currentRoute.value.name).toBe('register')
  })

  it('envía a login tras registrarse', async () => {
    vi.mocked(registerUseCase).mockResolvedValue(user)
    const { wrapper, router } = await mountView(RegisterView)

    await fill(wrapper)
    await submit(wrapper)

    expect(toast.success).toHaveBeenCalledOnce()
    expect(router.currentRoute.value.name).toBe('login')
  })
})

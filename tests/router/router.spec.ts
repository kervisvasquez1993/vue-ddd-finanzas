import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@/modules/auth'
import { UserEntity } from '@/modules/auth/domain/entities'
import router from '@/router'
import { Email } from '@/shared/domain/value-objects'

const signIn = () =>
  useAuthStore().setSession({
    accessToken: 'jwt',
    user: new UserEntity({ id: 'u1', name: 'Ana', email: Email.create('ana@test.com') }),
  })

describe('router', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it.each(['/', '/transactions', '/transactions/new', '/categories', '/categories/abc/edit'])(
    '%s exige sesión',
    async (path) => {
      await router.push(path)

      expect(router.currentRoute.value.name).toBe('login')
    },
  )

  it('con sesión entra a una ruta hija', async () => {
    signIn()

    await router.push('/transactions')

    expect(router.currentRoute.value.name).toBe('transactions')
  })

  it('con sesión no vuelve a login', async () => {
    signIn()

    await router.push('/login')

    expect(router.currentRoute.value.name).toBe('dashboard')
  })
})

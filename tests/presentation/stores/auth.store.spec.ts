import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserEntity } from '@/domain/auth/entities'
import { Email } from '@/domain/shared/value-objects'
import { useAuthStore } from '@/presentation/stores/auth.store'

const user = new UserEntity({
  id: 'user-1',
  name: 'Ana',
  email: Email.create('ana@test.com'),
})

const reloadStore = () => {
  setActivePinia(createPinia())
  return useAuthStore()
}

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('arranca sin sesión', () => {
    const store = useAuthStore()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })

  it('recupera la sesión tras recargar, con el usuario como entidad', () => {
    useAuthStore().setSession({ accessToken: 'token-123', user })

    const store = reloadStore()

    expect(store.accessToken).toBe('token-123')
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toBeInstanceOf(UserEntity)
    expect(store.user?.email.equals(user.email)).toBe(true)
  })

  it('persiste el usuario actualizado', () => {
    const store = useAuthStore()
    store.setSession({ accessToken: 'token-123', user })

    store.setUser(new UserEntity({ id: 'user-1', name: 'Ana Maria', email: user.email }))

    expect(reloadStore().user?.name).toBe('Ana Maria')
  })

  it('clearSession borra la sesión persistida', () => {
    const store = useAuthStore()
    store.setSession({ accessToken: 'token-123', user })

    store.clearSession()

    expect(localStorage.getItem('auth-storage')).toBeNull()
    expect(reloadStore().isAuthenticated).toBe(false)
  })

  it.each([
    ['JSON inválido', '{no-json'],
    ['email inválido', '{"accessToken":"t","user":{"id":"u","name":"A","email":"x"}}'],
  ])('descarta datos corruptos: %s', (_, stored) => {
    localStorage.setItem('auth-storage', stored)

    const store = useAuthStore()

    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth-storage')).toBeNull()
  })
})

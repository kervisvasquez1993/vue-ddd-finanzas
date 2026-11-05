import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { UserEntity } from '@/domain/auth/entities'
import type { AuthSession } from '@/domain/auth/repositories'
import { Email } from '@/domain/shared/value-objects'

const STORAGE_KEY = 'auth-storage'

interface PersistedUser {
  id: number
  email: string
  name: string
  role: string
}

interface PersistedSession {
  accessToken: string | null
  user: PersistedUser | null
}

const toPersistedUser = (user: UserEntity): PersistedUser => ({
  id: user.id,
  email: user.email.toString(),
  name: user.name,
  role: user.role,
})

const toUserEntity = (user: PersistedUser) =>
  new UserEntity({
    id: user.id,
    email: Email.create(user.email),
    name: user.name,
    role: user.role,
  })

const readPersistedSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const persisted = raw ? (JSON.parse(raw) as PersistedSession) : null

    return {
      accessToken: persisted?.accessToken ?? null,
      user: persisted?.user ? toUserEntity(persisted.user) : null,
    }
  } catch {
    // Datos corruptos o manipulados: se descartan y la sesión arranca vacía.
    localStorage.removeItem(STORAGE_KEY)
    return { accessToken: null, user: null }
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = readPersistedSession()

  const accessToken = ref<string | null>(session.accessToken)
  // shallowRef: la entidad es una clase plana y no debe envolverse en un proxy reactivo.
  const user = shallowRef<UserEntity | null>(session.user)
  const isAuthenticated = computed(() => !!accessToken.value)

  const persist = () => {
    if (!accessToken.value) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    const persisted: PersistedSession = {
      accessToken: accessToken.value,
      user: user.value ? toPersistedUser(user.value) : null,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  }

  const setSession = (newSession: AuthSession) => {
    accessToken.value = newSession.accessToken
    user.value = newSession.user
    persist()
  }

  const setUser = (newUser: UserEntity) => {
    user.value = newUser
    persist()
  }

  const clearSession = () => {
    accessToken.value = null
    user.value = null
    persist()
  }

  return { accessToken, user, isAuthenticated, setSession, setUser, clearSession }
})

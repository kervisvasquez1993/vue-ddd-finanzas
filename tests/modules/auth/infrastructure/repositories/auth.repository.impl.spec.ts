import { AxiosError, type AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserEntity } from '@/modules/auth/domain/entities'
import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '@/modules/auth/domain/errors'
import {
  InvalidEmailError,
  ServiceUnavailableError,
  type RequestValidationError,
} from '@/shared/domain/errors'
import { loginAction, registerAction } from '@/modules/auth/infrastructure/actions'
import { AuthRepositoryImpl } from '@/modules/auth/infrastructure/repositories'

vi.mock('@/modules/auth/infrastructure/actions')

const httpError = (status: number, message: string | string[]) =>
  new AxiosError('error', undefined, undefined, undefined, {
    status,
    data: { message },
  } as AxiosResponse)
const credentials = { email: 'ana@test.com', password: '123456' }
const userResponse = { id: 'uuid-1', name: 'Ana', email: 'ana@test.com' }

describe('AuthRepositoryImpl', () => {
  const repo = new AuthRepositoryImpl()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('login devuelve el token y el usuario como entidad', async () => {
    vi.mocked(loginAction).mockResolvedValue({ accessToken: 'jwt', user: userResponse })

    const session = await repo.login(credentials)

    expect(session.accessToken).toBe('jwt')
    expect(session.user).toBeInstanceOf(UserEntity)
  })

  it('traduce el 401 de login', async () => {
    vi.mocked(loginAction).mockRejectedValue(httpError(401, 'Credenciales inválidas.'))

    await expect(repo.login(credentials)).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('traduce el 409 de registro', async () => {
    vi.mocked(registerAction).mockRejectedValue(httpError(409, 'ya está registrado'))

    await expect(repo.register({ ...credentials, name: 'Ana' })).rejects.toBeInstanceOf(
      EmailAlreadyRegisteredError,
    )
  })

  it('conserva la lista de mensajes del 400', async () => {
    vi.mocked(registerAction).mockRejectedValue(httpError(400, ['uno', 'dos']))

    await expect(repo.register({ ...credentials, name: 'Ana' })).rejects.toMatchObject({
      messages: ['uno', 'dos'],
    } satisfies Partial<RequestValidationError>)
  })

  it('traduce un 500 a servicio no disponible', async () => {
    vi.mocked(loginAction).mockRejectedValue(httpError(500, 'Error interno del servidor.'))

    await expect(repo.login(credentials)).rejects.toBeInstanceOf(ServiceUnavailableError)
  })

  it('el error de una respuesta inválida no se confunde con HTTP', async () => {
    vi.mocked(registerAction).mockResolvedValue({ ...userResponse, email: 'mal' })

    await expect(repo.register({ ...credentials, name: 'Ana' })).rejects.toBeInstanceOf(
      InvalidEmailError,
    )
  })
})

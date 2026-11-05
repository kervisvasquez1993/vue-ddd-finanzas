import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loginUseCaseFactory, registerUseCaseFactory } from '@/aplication/use-cases/auth'
import type { AuthSession, IAuthRepository } from '@/domain/auth/repositories'
import type { UserEntity } from '@/domain/auth/entities'
import { InvalidEmailError } from '@/domain/shared/errors'

describe('casos de uso de auth', () => {
  const repo = {
    login: vi.fn<IAuthRepository['login']>(),
    register: vi.fn<IAuthRepository['register']>(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    repo.login.mockResolvedValue({} as AuthSession)
    repo.register.mockResolvedValue({} as UserEntity)
  })

  it('login normaliza el email', async () => {
    await loginUseCaseFactory(repo)({ email: '  Kervis@Test.com ', password: ' 123456 ' })

    expect(repo.login).toHaveBeenCalledWith({ email: 'kervis@test.com', password: ' 123456 ' })
  })

  it('registro normaliza nombre y email', async () => {
    await registerUseCaseFactory(repo)({
      name: '  Kervis ',
      email: 'Kervis@Test.com',
      password: '123456',
    })

    expect(repo.register).toHaveBeenCalledWith({
      name: 'Kervis',
      email: 'kervis@test.com',
      password: '123456',
    })
  })

  it('no llama al backend con un email inválido', () => {
    expect(() => loginUseCaseFactory(repo)({ email: 'mal', password: 'x' })).toThrow(
      InvalidEmailError,
    )
    expect(repo.login).not.toHaveBeenCalled()
  })
})

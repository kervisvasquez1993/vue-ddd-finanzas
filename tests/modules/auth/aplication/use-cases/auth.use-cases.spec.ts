import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loginUseCaseFactory, registerUseCaseFactory } from '@/modules/auth/aplication/use-cases'
import type { AuthSession, IAuthRepository } from '@/modules/auth/domain/repositories'
import type { UserEntity } from '@/modules/auth/domain/entities'
import { InvalidEmailError } from '@/shared/domain/errors'

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

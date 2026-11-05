import type { ILoginRequest } from '@/domain/auth/dto'
import type { IAuthRepository } from '@/domain/auth/repositories'
import { Email } from '@/domain/shared/value-objects'
import { authRepository } from '@/infrastructure/repositories/auth'

export const loginUseCaseFactory = (repo: IAuthRepository) => (data: ILoginRequest) =>
  repo.login({ email: Email.create(data.email).toString(), password: data.password })

export const loginUseCase = loginUseCaseFactory(authRepository)

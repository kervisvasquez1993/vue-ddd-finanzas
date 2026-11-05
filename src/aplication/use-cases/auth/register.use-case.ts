import type { IRegisterRequest } from '@/domain/auth/dto'
import type { IAuthRepository } from '@/domain/auth/repositories'
import { Email } from '@/domain/shared/value-objects'
import { authRepository } from '@/infrastructure/repositories/auth'

export const registerUseCaseFactory = (repo: IAuthRepository) => (data: IRegisterRequest) =>
  repo.register({
    name: data.name.trim(),
    email: Email.create(data.email).toString(),
    password: data.password,
  })

export const registerUseCase = registerUseCaseFactory(authRepository)

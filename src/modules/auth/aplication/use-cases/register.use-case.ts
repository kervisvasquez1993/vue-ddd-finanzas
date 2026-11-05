import type { IRegisterRequest } from '@/modules/auth/domain/dto'
import type { IAuthRepository } from '@/modules/auth/domain/repositories'
import { Email } from '@/shared/domain/value-objects'

export const registerUseCaseFactory = (repo: IAuthRepository) => (data: IRegisterRequest) =>
  repo.register({
    name: data.name.trim(),
    email: Email.create(data.email).toString(),
    password: data.password,
  })

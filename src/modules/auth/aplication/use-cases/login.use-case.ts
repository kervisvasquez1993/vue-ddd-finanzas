import type { ILoginRequest } from '@/modules/auth/domain/dto'
import type { IAuthRepository } from '@/modules/auth/domain/repositories'
import { Email } from '@/shared/domain/value-objects'

export const loginUseCaseFactory = (repo: IAuthRepository) => (data: ILoginRequest) =>
  repo.login({ email: Email.create(data.email).toString(), password: data.password })

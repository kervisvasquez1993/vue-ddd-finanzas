import type { ILoginRequest, IRegisterRequest } from '@/modules/auth/domain/dto'
import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '@/modules/auth/domain/errors'
import type { IAuthRepository } from '@/modules/auth/domain/repositories'
import { loginAction, registerAction } from '@/modules/auth/infrastructure/actions'
import { toDomainError } from '@/api/http-error'
import { UserMapper } from '@/modules/auth/infrastructure/mappers'

export class AuthRepositoryImpl implements IAuthRepository {
  async login(data: ILoginRequest) {
    try {
      const { accessToken, user } = await loginAction(data)
      return { accessToken, user: UserMapper.toEntity(user) }
    } catch (error) {
      throw toDomainError(error, { 401: () => new InvalidCredentialsError() })
    }
  }

  async register(data: IRegisterRequest) {
    try {
      return UserMapper.toEntity(await registerAction(data))
    } catch (error) {
      throw toDomainError(error, { 409: () => new EmailAlreadyRegisteredError() })
    }
  }
}

export const authRepository: IAuthRepository = new AuthRepositoryImpl()

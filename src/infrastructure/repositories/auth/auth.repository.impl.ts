import type { ILoginRequest, IRegisterRequest } from '@/domain/auth/dto'
import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '@/domain/auth/errors'
import type { IAuthRepository } from '@/domain/auth/repositories'
import { loginAction, registerAction } from '@/infrastructure/actions/auth'
import { toDomainError } from '@/infrastructure/api/http-error'
import { UserMapper } from '@/infrastructure/mappers/auth'

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

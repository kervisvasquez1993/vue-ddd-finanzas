import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '@/domain/auth/errors'
import type { ILoginRequest, IRegisterRequest } from '@/domain/auth/dto'
import type { IAuthRepository } from '@/domain/auth/repositories'
import { RequestValidationError } from '@/domain/shared/errors'
import { loginAction, registerAction } from '@/infrastructure/actions/auth'
import { normalizeHttpError } from '@/infrastructure/api/http-error'
import { UserMapper } from '@/infrastructure/mappers/auth'

export class AuthRepositoryImpl implements IAuthRepository {
  async login(data: ILoginRequest) {
    try {
      const { accessToken, user } = await loginAction(data)
      return { accessToken, user: UserMapper.toEntity(user) }
    } catch (error) {
      const { statusCode, messages } = normalizeHttpError(error)
      if (statusCode === 400) throw new RequestValidationError(messages)
      if (statusCode === 401) throw new InvalidCredentialsError()
      throw error
    }
  }

  async register(data: IRegisterRequest) {
    try {
      return UserMapper.toEntity(await registerAction(data))
    } catch (error) {
      const { statusCode, messages } = normalizeHttpError(error)
      if (statusCode === 400) throw new RequestValidationError(messages)
      if (statusCode === 409) throw new EmailAlreadyRegisteredError()
      throw error
    }
  }
}

export const authRepository: IAuthRepository = new AuthRepositoryImpl()

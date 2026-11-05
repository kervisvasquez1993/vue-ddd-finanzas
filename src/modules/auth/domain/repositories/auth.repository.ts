import type { ILoginRequest, IRegisterRequest } from '@/modules/auth/domain/dto'
import type { UserEntity } from '@/modules/auth/domain/entities'

export interface AuthSession {
  accessToken: string
  user: UserEntity
}

export interface IAuthRepository {
  login(data: ILoginRequest): Promise<AuthSession>
  register(data: IRegisterRequest): Promise<UserEntity>
}

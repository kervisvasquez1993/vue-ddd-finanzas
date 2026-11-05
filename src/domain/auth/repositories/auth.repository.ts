import type { ILoginRequest, IRegisterRequest } from '@/domain/auth/dto'
import type { UserEntity } from '@/domain/auth/entities'

export interface AuthSession {
  accessToken: string
  user: UserEntity
}

export interface IAuthRepository {
  login(data: ILoginRequest): Promise<AuthSession>
  register(data: IRegisterRequest): Promise<UserEntity>
}

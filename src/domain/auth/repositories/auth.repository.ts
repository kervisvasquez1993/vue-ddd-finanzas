import type { UserEntity } from '@/domain/auth/entities'

export interface AuthSession {
  accessToken: string
  user: UserEntity
}

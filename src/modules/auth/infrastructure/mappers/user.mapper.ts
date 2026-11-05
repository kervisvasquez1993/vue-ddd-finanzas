import { UserEntity } from '@/modules/auth/domain/entities'
import { Email } from '@/shared/domain/value-objects'
import type { UserResponse } from '@/modules/auth/infrastructure/interfaces'

export class UserMapper {
  static toEntity(response: UserResponse): UserEntity {
    return new UserEntity({
      id: response.id,
      name: response.name,
      email: Email.create(response.email),
    })
  }
}

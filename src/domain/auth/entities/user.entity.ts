import type { Email } from '@/domain/shared/value-objects'

export interface UserEntityProps {
  id: string
  name: string
  email: Email
}

export class UserEntity {
  private readonly props: UserEntityProps

  constructor(props: UserEntityProps) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }
}

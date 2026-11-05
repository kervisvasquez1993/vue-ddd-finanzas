import type { Email } from '@/domain/shared/value-objects'

export interface UserEntityProps {
  id: number
  email: Email
  name: string
  role: string
}

export class UserEntity {
  private readonly props: UserEntityProps

  constructor(props: UserEntityProps) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  get role() {
    return this.props.role
  }
}

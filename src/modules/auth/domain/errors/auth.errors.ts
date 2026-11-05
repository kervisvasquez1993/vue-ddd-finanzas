import { DomainError } from '@/shared/domain/errors'

export class InvalidCredentialsError extends DomainError {
  readonly code = 'INVALID_CREDENTIALS'

  constructor() {
    super('Email o contraseña incorrectos')
  }
}

export class EmailAlreadyRegisteredError extends DomainError {
  readonly code = 'EMAIL_ALREADY_REGISTERED'

  constructor() {
    super('Este email ya está registrado')
  }
}

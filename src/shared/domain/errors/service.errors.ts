import { DomainError } from './domain.error'

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED'

  constructor() {
    super('Tu sesión expiró. Inicia sesión de nuevo.')
  }
}

/** Fallo de red, CORS o 5xx: temporal y sin relación con los datos del usuario. */
export class ServiceUnavailableError extends DomainError {
  readonly code = 'SERVICE_UNAVAILABLE'

  constructor() {
    super('No pudimos completar la operación. Inténtalo de nuevo.')
  }
}

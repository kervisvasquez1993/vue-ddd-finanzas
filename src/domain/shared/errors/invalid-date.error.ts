import { DomainError } from './domain.error'

export class InvalidDateError extends DomainError {
  readonly code = 'INVALID_DATE'
}

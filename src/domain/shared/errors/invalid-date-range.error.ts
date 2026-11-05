import { DomainError } from './domain.error'

export class InvalidDateRangeError extends DomainError {
  readonly code = 'INVALID_DATE_RANGE'
}

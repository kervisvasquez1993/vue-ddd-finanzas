import { DomainError } from '@/domain/shared/errors'

export class InvalidTransactionError extends DomainError {
  readonly code = 'INVALID_TRANSACTION'
}

export class TransactionNotFoundError extends DomainError {
  readonly code = 'TRANSACTION_NOT_FOUND'

  constructor() {
    super('La transacción no existe')
  }
}

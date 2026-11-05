import { DomainError } from '@/shared/domain/errors'

export class InvalidTransactionError extends DomainError {
  readonly code = 'INVALID_TRANSACTION'
}

export class TransactionCategoryNotFoundError extends DomainError {
  readonly code = 'TRANSACTION_CATEGORY_NOT_FOUND'

  constructor() {
    super('La categoría no existe')
  }
}

export class TransactionNotFoundError extends DomainError {
  readonly code = 'TRANSACTION_NOT_FOUND'

  constructor() {
    super('La transacción no existe')
  }
}

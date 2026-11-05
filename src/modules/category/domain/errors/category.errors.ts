import { DomainError } from '@/shared/domain/errors'

export class InvalidCategoryError extends DomainError {
  readonly code = 'INVALID_CATEGORY'
}

export class CategoryNotFoundError extends DomainError {
  readonly code = 'CATEGORY_NOT_FOUND'

  constructor() {
    super('La categoría no existe')
  }
}

export class CategoryNameAlreadyExistsError extends DomainError {
  readonly code = 'CATEGORY_NAME_ALREADY_EXISTS'

  constructor() {
    super('Ya tienes una categoría con ese nombre')
  }
}

export class CategoryHasTransactionsError extends DomainError {
  readonly code = 'CATEGORY_HAS_TRANSACTIONS'

  constructor() {
    super('No se puede eliminar una categoría con transacciones')
  }
}

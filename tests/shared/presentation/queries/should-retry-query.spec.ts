import { describe, expect, it } from 'vitest'
import {
  RequestValidationError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '@/shared/domain/errors'
import { shouldRetryQuery } from '@/shared/presentation/queries/should-retry-query'

describe('shouldRetryQuery', () => {
  it.each([
    ['servicio no disponible', new ServiceUnavailableError(), true],
    ['sesión vencida', new UnauthorizedError(), false],
    ['validación', new RequestValidationError(['x']), false],
    ['error de programación', new TypeError('x'), false],
  ])('%s', (_, error, expected) => {
    expect(shouldRetryQuery(0, error)).toBe(expected)
  })

  it('deja de reintentar al llegar al límite', () => {
    expect(shouldRetryQuery(2, new ServiceUnavailableError())).toBe(false)
  })
})

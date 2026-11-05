import { isAxiosError } from 'axios'
import {
  DomainError,
  RequestValidationError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '@/domain/shared/errors'

export interface NormalizedHttpError {
  /** 0 cuando no hubo respuesta (red o CORS). */
  statusCode: number
  messages: string[]
}

export const normalizeHttpError = (error: unknown): NormalizedHttpError => {
  const response = (
    error as { response?: { status?: number; data?: { message?: string | string[] } } }
  )?.response
  const message = response?.data?.message

  return {
    statusCode: response?.status ?? 0,
    messages: Array.isArray(message) ? message : message ? [message] : [],
  }
}

/**
 * Traduce un error HTTP a uno de dominio, para que HTTP no salga de infrastructure.
 * `overrides` da significado a un estado en un endpoint concreto (el 401 de login son
 * credenciales incorrectas, no una sesión vencida).
 */
export const toDomainError = (
  error: unknown,
  overrides: Partial<Record<number, () => DomainError>> = {},
): unknown => {
  if (!isAxiosError(error)) return error

  const { statusCode, messages } = normalizeHttpError(error)
  const override = overrides[statusCode]

  if (override) return override()
  if (statusCode === 400) return new RequestValidationError(messages)
  if (statusCode === 401) return new UnauthorizedError()
  if (statusCode === 0 || statusCode >= 500) return new ServiceUnavailableError()
  return error
}

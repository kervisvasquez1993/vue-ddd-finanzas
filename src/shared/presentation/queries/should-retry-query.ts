import { ServiceUnavailableError } from '@/shared/domain/errors'

const MAX_RETRIES = 2

/** Solo los fallos temporales se reintentan; repetir un 400 o un 401 daría el mismo resultado. */
export const shouldRetryQuery = (failureCount: number, error: unknown) =>
  error instanceof ServiceUnavailableError && failureCount < MAX_RETRIES

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

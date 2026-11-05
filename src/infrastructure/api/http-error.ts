/** Texto crudo del backend (une los arrays de validación de Nest). */
export const rawBackendMessage = (error: unknown): string | undefined => {
  const message = (error as { response?: { data?: { message?: string | string[] } } })?.response
    ?.data?.message
  return Array.isArray(message) ? message.join(', ') : message
}

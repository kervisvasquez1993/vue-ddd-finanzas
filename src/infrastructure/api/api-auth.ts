/**
 * Infrastructure no puede importar de presentation, así que no conoce el store de auth:
 * main.ts le inyecta estos handlers al arrancar la app.
 */
export interface ApiAuthHandlers {
  getAccessToken: () => string | null
  onUnauthorized: () => void
}

let handlers: ApiAuthHandlers = {
  getAccessToken: () => null,
  onUnauthorized: () => {},
}

export const configureApiAuth = (authHandlers: ApiAuthHandlers) => {
  handlers = authHandlers
}

export const getApiAuth = (): ApiAuthHandlers => handlers

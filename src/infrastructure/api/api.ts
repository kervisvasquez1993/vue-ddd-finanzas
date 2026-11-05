import { createApiClient } from './api.factory'

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

const baseHeaders = {
  'Content-Type': 'application/json',
}

export const publicApi = createApiClient({
  baseUrl: BASE_URL,
  useInterceptors: false,
  headers: baseHeaders,
})

export const authApi = createApiClient({
  baseUrl: BASE_URL,
  useInterceptors: true,
  headers: baseHeaders,
})

import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { AxiosAdapter, type AxiosAdapterOptions } from './adapters/axios.adapters'
import type { HttpAdapter } from './adapters/http.adapters'
import { getApiAuth } from './api-auth'

interface ApiFactoryOptions {
  baseUrl: string
  params?: Record<string, string>
  headers?: Record<string, string>
  useInterceptors?: boolean
}

export const createApiClient = (options: ApiFactoryOptions): HttpAdapter => {
  const adapterOptions: AxiosAdapterOptions = {
    baseUrl: options.baseUrl,
    params: options.params,
    headers: options.headers,
  }

  if (options.useInterceptors) {
    adapterOptions.interceptors = {
      request: {
        onFulfilled: (config: InternalAxiosRequestConfig) => {
          const token = getApiAuth().getAccessToken()

          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }

          return config
        },
      },
      response: {
        onRejected: (error: AxiosError) => {
          if (error.response?.status === 401) {
            getApiAuth().onUnauthorized()
          }
          return Promise.reject(error)
        },
      },
    }
  }

  return new AxiosAdapter(adapterOptions)
}

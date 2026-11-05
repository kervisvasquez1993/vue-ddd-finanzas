import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { HttpAdapter } from './http.adapters'

interface RequestInterceptorHandlers {
  onFulfilled?: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  onRejected?: (error: AxiosError) => Promise<never>
}

interface ResponseInterceptorHandlers {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  onRejected?: (error: AxiosError) => Promise<never>
}

export interface AxiosAdapterOptions {
  baseUrl: string
  params?: Record<string, string>
  headers?: Record<string, string>
  interceptors?: {
    request?: RequestInterceptorHandlers
    response?: ResponseInterceptorHandlers
  }
}

export class AxiosAdapter implements HttpAdapter {
  private axiosInstance: AxiosInstance

  constructor(options: AxiosAdapterOptions) {
    this.axiosInstance = axios.create({
      baseURL: options.baseUrl,
      params: options.params,
      headers: options.headers,
    })

    if (options.interceptors?.request) {
      this.axiosInstance.interceptors.request.use(
        options.interceptors.request.onFulfilled,
        options.interceptors.request.onRejected,
      )
    }

    if (options.interceptors?.response) {
      this.axiosInstance.interceptors.response.use(
        options.interceptors.response.onFulfilled,
        options.interceptors.response.onRejected,
      )
    }
  }

  async get<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.get<T>(url, options)
    return data
  }

  async post<T>(url: string, postData: unknown, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.post<T>(url, postData, options)
    return data
  }

  async put<T>(url: string, putData: unknown, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.put<T>(url, putData, options)
    return data
  }

  async delete<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.delete<T>(url, options)
    return data
  }

  async patch<T>(url: string, patchData: unknown, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.patch<T>(url, patchData, options)
    return data
  }
}

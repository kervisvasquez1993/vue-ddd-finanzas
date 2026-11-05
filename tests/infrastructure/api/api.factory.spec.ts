import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApiClient } from '@/infrastructure/api/api.factory'
import { configureApiAuth } from '@/infrastructure/api/api-auth'
import { rawBackendMessage } from '@/infrastructure/api/http-error'

const respond = (config: InternalAxiosRequestConfig, data: unknown): AxiosResponse => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
})

describe('createApiClient', () => {
  const onUnauthorized = vi.fn<() => void>()
  const transport = vi.fn<(config: InternalAxiosRequestConfig) => Promise<AxiosResponse>>()

  beforeEach(() => {
    vi.clearAllMocks()
    axios.defaults.adapter = transport
    transport.mockImplementation(async (config) => respond(config, { success: true, data: [1] }))
    configureApiAuth({ getAccessToken: () => 'token-123', onUnauthorized })
  })

  it('devuelve el body sin el envelope de axios', async () => {
    const api = createApiClient({ baseUrl: 'http://api.test', useInterceptors: true })

    await expect(api.get('/stores')).resolves.toEqual({ success: true, data: [1] })
  })

  it('agrega el Bearer con interceptores', async () => {
    const api = createApiClient({ baseUrl: 'http://api.test', useInterceptors: true })

    await api.get('/stores')

    expect(transport.mock.calls[0]?.[0].headers.Authorization).toBe('Bearer token-123')
  })

  it('no agrega el Bearer sin interceptores', async () => {
    const api = createApiClient({ baseUrl: 'http://api.test', useInterceptors: false })

    await api.get('/stores')

    expect(transport.mock.calls[0]?.[0].headers.Authorization).toBeUndefined()
  })

  it('avisa del 401 y propaga el error', async () => {
    transport.mockImplementation(async (config) => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
        ...respond(config, {}),
        status: 401,
      })
    })
    const api = createApiClient({ baseUrl: 'http://api.test', useInterceptors: true })

    await expect(api.get('/stores')).rejects.toBeInstanceOf(AxiosError)
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})

describe('rawBackendMessage', () => {
  it('une los mensajes de validación', () => {
    const error = { response: { data: { message: ['uno', 'dos'] } } }

    expect(rawBackendMessage(error)).toBe('uno, dos')
  })

  it('devuelve undefined si no hay mensaje', () => {
    expect(rawBackendMessage(new Error('red'))).toBeUndefined()
  })
})

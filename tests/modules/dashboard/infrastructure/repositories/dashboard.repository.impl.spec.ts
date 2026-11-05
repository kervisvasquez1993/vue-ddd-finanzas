import { AxiosError, type AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardSummaryEntity } from '@/modules/dashboard/domain/entities'
import {
  RequestValidationError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '@/shared/domain/errors'
import { getDashboardAction } from '@/modules/dashboard/infrastructure/actions'
import { DashboardRepositoryImpl } from '@/modules/dashboard/infrastructure/repositories'

vi.mock('@/modules/dashboard/infrastructure/actions')

const httpError = (status: number, message: string | string[]) =>
  new AxiosError('error', undefined, undefined, undefined, {
    status,
    data: { message },
  } as AxiosResponse)

describe('DashboardRepositoryImpl', () => {
  const repo = new DashboardRepositoryImpl()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('mapea la respuesta a una entidad', async () => {
    vi.mocked(getDashboardAction).mockResolvedValue({
      saldoAtual: 2300,
      totalEntradas: 2500,
      totalSaidas: 200,
      topCategoriasSaidas: [],
      periodo: { startDate: '2026-06-01', endDate: '2026-06-30' },
    })

    const summary = await repo.getSummary({ startDate: '2026-06-01', endDate: '2026-06-30' })

    expect(summary).toBeInstanceOf(DashboardSummaryEntity)
    expect(summary.saldoAtual).toBe(2300)
    expect(getDashboardAction).toHaveBeenCalledWith({
      startDate: '2026-06-01',
      endDate: '2026-06-30',
    })
  })

  it.each([
    ['400', httpError(400, ['startDate must be a valid']), RequestValidationError],
    ['401', httpError(401, 'Token inválido o expirado.'), UnauthorizedError],
    ['500', httpError(500, 'Error interno del servidor.'), ServiceUnavailableError],
    ['sin respuesta', new AxiosError('Network Error'), ServiceUnavailableError],
  ])('traduce %s', async (_, error, expected) => {
    vi.mocked(getDashboardAction).mockRejectedValue(error)

    await expect(repo.getSummary({})).rejects.toBeInstanceOf(expected)
  })

  it('no disfraza un error de programación', async () => {
    const error = new TypeError('bug')
    vi.mocked(getDashboardAction).mockRejectedValue(error)

    await expect(repo.getSummary({})).rejects.toBe(error)
  })
})

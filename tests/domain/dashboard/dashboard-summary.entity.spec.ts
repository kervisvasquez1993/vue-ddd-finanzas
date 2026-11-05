import { describe, expect, it } from 'vitest'
import { DashboardSummaryEntity } from '@/domain/dashboard/entities'

const build = (overrides = {}) =>
  new DashboardSummaryEntity({
    saldoAtual: 0,
    totalEntradas: 0,
    totalSaidas: 0,
    topCategoriasSaidas: [],
    periodo: { startDate: null, endDate: null },
    ...overrides,
  })

describe('DashboardSummaryEntity', () => {
  it('sin totales no tiene movimientos', () => {
    expect(build().hasMovimientos()).toBe(false)
  })

  it('tiene movimientos aunque el saldo sea 0', () => {
    expect(build({ totalEntradas: 100, totalSaidas: 100 }).hasMovimientos()).toBe(true)
  })

  it('tiene período con una sola fecha', () => {
    expect(build().hasPeriodo()).toBe(false)
    expect(build({ periodo: { startDate: null, endDate: '2026-06-30' } }).hasPeriodo()).toBe(true)
  })
})

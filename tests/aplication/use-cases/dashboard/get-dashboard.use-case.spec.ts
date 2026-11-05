import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDashboardUseCaseFactory } from '@/aplication/use-cases/dashboard'
import type { DashboardSummaryEntity } from '@/domain/dashboard/entities'
import type { IDashboardRepository } from '@/domain/dashboard/repositories'
import { InvalidDateError } from '@/domain/shared/errors'

describe('getDashboardUseCase', () => {
  const repo = { getSummary: vi.fn<IDashboardRepository['getSummary']>() }

  beforeEach(() => {
    vi.clearAllMocks()
    repo.getSummary.mockResolvedValue({} as DashboardSummaryEntity)
  })

  it('no envía parámetros sin valor', async () => {
    await getDashboardUseCaseFactory(repo)({ startDate: '', endDate: '2026-06-30' })

    expect(repo.getSummary).toHaveBeenCalledWith({ endDate: '2026-06-30' })
  })

  it('no llama al backend con una fecha inexistente', async () => {
    await expect(
      getDashboardUseCaseFactory(repo)({ startDate: '2026-02-30' }),
    ).rejects.toBeInstanceOf(InvalidDateError)
    expect(repo.getSummary).not.toHaveBeenCalled()
  })
})

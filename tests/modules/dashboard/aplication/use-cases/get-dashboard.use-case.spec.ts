import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDashboardUseCaseFactory } from '@/modules/dashboard/aplication/use-cases'
import type { DashboardSummaryEntity } from '@/modules/dashboard/domain/entities'
import type { IDashboardRepository } from '@/modules/dashboard/domain/repositories'
import { InvalidDateError } from '@/shared/domain/errors'

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

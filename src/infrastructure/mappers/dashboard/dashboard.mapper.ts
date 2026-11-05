import { DashboardSummaryEntity } from '@/domain/dashboard/entities'
import type { DashboardResponse } from '@/infrastructure/interfaces'

export class DashboardMapper {
  static toEntity(response: DashboardResponse): DashboardSummaryEntity {
    return new DashboardSummaryEntity({
      saldoAtual: response.saldoAtual,
      totalEntradas: response.totalEntradas,
      totalSaidas: response.totalSaidas,
      topCategoriasSaidas: response.topCategoriasSaidas,
      periodo: response.periodo,
    })
  }
}

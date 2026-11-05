export interface TopCategoriaSaida {
  categoryId: string
  categoryName: string
  total: number
}

export interface DashboardPeriodo {
  startDate: string | null
  endDate: string | null
}

export interface DashboardSummaryProps {
  saldoAtual: number
  totalEntradas: number
  totalSaidas: number
  topCategoriasSaidas: TopCategoriaSaida[]
  periodo: DashboardPeriodo
}

export class DashboardSummaryEntity {
  private readonly props: DashboardSummaryProps

  constructor(props: DashboardSummaryProps) {
    this.props = props
  }

  get saldoAtual() {
    return this.props.saldoAtual
  }

  get totalEntradas() {
    return this.props.totalEntradas
  }

  get totalSaidas() {
    return this.props.totalSaidas
  }

  get topCategoriasSaidas() {
    return this.props.topCategoriasSaidas
  }

  get periodo() {
    return this.props.periodo
  }

  /** Con filtro, `saldoAtual` es el resultado del rango y no el saldo total de la cuenta. */
  hasPeriodo() {
    return !!this.props.periodo.startDate || !!this.props.periodo.endDate
  }

  hasMovimientos() {
    return this.props.totalEntradas > 0 || this.props.totalSaidas > 0
  }
}

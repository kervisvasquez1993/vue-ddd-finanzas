export interface CategorySummaryProps {
  id: string
  name: string
  description: string | null
  transactionsCount: number
  totalEntradas: number
  totalSaidas: number
}

export class CategorySummaryEntity {
  private readonly props: CategorySummaryProps

  constructor(props: CategorySummaryProps) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get transactionsCount() {
    return this.props.transactionsCount
  }

  get totalEntradas() {
    return this.props.totalEntradas
  }

  get totalSaidas() {
    return this.props.totalSaidas
  }

  canBeDeleted() {
    return this.props.transactionsCount === 0
  }
}

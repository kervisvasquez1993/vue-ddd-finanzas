import { InvalidDateRangeError } from '@/domain/shared/errors'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** El backend responde 500 con fechas que no existen (2026-02-30), así que se rechazan aquí. */
const isRealDate = (value: string) => {
  if (!DATE_PATTERN.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

const normalize = (value?: string | null) => {
  if (!value) return undefined
  if (!isRealDate(value)) throw new InvalidDateRangeError(`Fecha inválida: ${value}`)
  return value
}

export class DateRange {
  readonly startDate?: string
  readonly endDate?: string

  private constructor(startDate?: string, endDate?: string) {
    this.startDate = startDate
    this.endDate = endDate
  }

  static create(range: { startDate?: string | null; endDate?: string | null }): DateRange {
    const startDate = normalize(range.startDate)
    const endDate = normalize(range.endDate)

    // El formato YYYY-MM-DD permite comparar como texto.
    if (startDate && endDate && startDate > endDate) {
      throw new InvalidDateRangeError('La fecha inicial no puede ser posterior a la final')
    }

    return new DateRange(startDate, endDate)
  }

  /** Solo las fechas con valor: el backend responde 400 a un `?startDate=` vacío. */
  toParams() {
    return {
      ...(this.startDate && { startDate: this.startDate }),
      ...(this.endDate && { endDate: this.endDate }),
    }
  }
}

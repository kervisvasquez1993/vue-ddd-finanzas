import { InvalidDateRangeError } from '@/domain/shared/errors'
import { CalendarDate } from './calendar-date.vo'

const normalize = (value?: string | null) =>
  value ? CalendarDate.create(value).toString() : undefined

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

import { InvalidDateError } from '@/shared/domain/errors'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** El backend responde 500 con fechas que no existen (2026-02-30), así que se rechazan aquí. */
const isRealDate = (value: string) => {
  if (!DATE_PATTERN.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

export class CalendarDate {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): CalendarDate {
    if (!isRealDate(value)) throw new InvalidDateError(`Fecha inválida: ${value}`)
    return new CalendarDate(value)
  }

  toString() {
    return this.value
  }
}

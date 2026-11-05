import { describe, expect, it } from 'vitest'
import { InvalidDateRangeError } from '@/domain/shared/errors'
import { DateRange } from '@/domain/shared/value-objects'

describe('DateRange', () => {
  it('omite las fechas vacías', () => {
    expect(DateRange.create({ startDate: '', endDate: undefined }).toParams()).toEqual({})
  })

  it('acepta un solo extremo', () => {
    expect(DateRange.create({ startDate: '2026-06-01' }).toParams()).toEqual({
      startDate: '2026-06-01',
    })
  })

  it('acepta el mismo día como inicio y fin', () => {
    const range = { startDate: '2026-06-01', endDate: '2026-06-01' }

    expect(DateRange.create(range).toParams()).toEqual(range)
  })

  it.each(['2026-02-30', '2026-13-01', '01/06/2026', '2026-6-1'])('rechaza %s', (startDate) => {
    expect(() => DateRange.create({ startDate })).toThrow(InvalidDateRangeError)
  })

  it('acepta el 29 de febrero solo en año bisiesto', () => {
    expect(() => DateRange.create({ startDate: '2028-02-29' })).not.toThrow()
    expect(() => DateRange.create({ startDate: '2026-02-29' })).toThrow(InvalidDateRangeError)
  })

  it('rechaza un inicio posterior al fin', () => {
    expect(() => DateRange.create({ startDate: '2026-06-30', endDate: '2026-06-01' })).toThrow(
      InvalidDateRangeError,
    )
  })
})

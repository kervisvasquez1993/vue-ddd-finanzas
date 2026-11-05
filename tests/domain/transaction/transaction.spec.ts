import { describe, expect, it } from 'vitest'
import { InvalidDateError } from '@/domain/shared/errors'
import type { ITransactionInput } from '@/domain/transaction/dto'
import { TransactionEntity } from '@/domain/transaction/entities'
import { InvalidTransactionError } from '@/domain/transaction/errors'
import { TransactionDraft } from '@/domain/transaction/value-objects'

const input: ITransactionInput = {
  description: 'Pago',
  amount: 150.5,
  type: 'saida',
  date: '2026-06-16',
  categoryId: 'c1',
}

const transaction = new TransactionEntity({ ...input, id: 't1', categoryName: 'Fornecedor' })

describe('TransactionDraft', () => {
  it('recorta la descripción', () => {
    expect(TransactionDraft.create({ ...input, description: ' Pago ' }).toRequest()).toEqual(input)
  })

  it.each([
    ['descripción vacía', { description: '   ' }],
    ['descripción larga', { description: 'a'.repeat(256) }],
    ['monto 0', { amount: 0 }],
    ['monto negativo', { amount: -1 }],
    ['monto NaN', { amount: Number.NaN }],
    ['tres decimales', { amount: 10.123 }],
    ['monto excesivo', { amount: 10000000000 }],
    ['tipo inválido', { type: 'otro' as 'saida' }],
    ['sin categoría', { categoryId: '' }],
  ])('rechaza %s', (_, patch) => {
    expect(() => TransactionDraft.create({ ...input, ...patch })).toThrow(InvalidTransactionError)
  })

  it.each([0.01, 10.2, 150.55, 1.1, 9999999999.99])('acepta el monto %d', (amount) => {
    expect(() => TransactionDraft.create({ ...input, amount })).not.toThrow()
  })

  it('rechaza una fecha que no existe', () => {
    expect(() => TransactionDraft.create({ ...input, date: '2026-02-30' })).toThrow(
      InvalidDateError,
    )
  })
})

describe('TransactionEntity', () => {
  it('sin cambios no devuelve nada', () => {
    expect(transaction.getChanges({ ...input, description: ' Pago ' })).toEqual({})
  })

  it('devuelve solo lo modificado', () => {
    expect(transaction.getChanges({ ...input, amount: 200, type: 'entrada' })).toEqual({
      amount: 200,
      type: 'entrada',
    })
  })

  it('nunca incluye categoryId, que el backend no guarda', () => {
    expect(transaction.getChanges({ ...input, categoryId: 'c2' })).toEqual({})
  })

  it('distingue entradas de salidas', () => {
    expect(transaction.isEntrada()).toBe(false)
  })
})

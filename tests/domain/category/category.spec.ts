import { describe, expect, it } from 'vitest'
import { CategoryEntity, CategorySummaryEntity } from '@/domain/category/entities'
import { InvalidCategoryError } from '@/domain/category/errors'
import { CategoryDescription, CategoryName } from '@/domain/category/value-objects'

const category = new CategoryEntity({ id: 'c1', name: 'Fornecedor', description: 'Pagos' })

describe('CategoryName', () => {
  it('recorta los espacios', () => {
    expect(CategoryName.create('  Fornecedor ').toString()).toBe('Fornecedor')
  })

  it.each(['', '   ', 'a'.repeat(121)])('rechaza un nombre inválido', (value) => {
    expect(() => CategoryName.create(value)).toThrow(InvalidCategoryError)
  })

  it('acepta el largo máximo', () => {
    expect(() => CategoryName.create('a'.repeat(120))).not.toThrow()
  })
})

describe('CategoryDescription', () => {
  it.each([undefined, null, '', '   '])('convierte %j en null', (value) => {
    expect(CategoryDescription.create(value).value).toBeNull()
  })

  it('rechaza más de 255 caracteres', () => {
    expect(() => CategoryDescription.create('a'.repeat(256))).toThrow(InvalidCategoryError)
  })
})

describe('CategoryEntity.getChanges', () => {
  it('no devuelve nada si nada cambió', () => {
    expect(category.getChanges({ name: ' Fornecedor ', description: 'Pagos ' })).toEqual({})
  })

  it('devuelve solo el campo modificado', () => {
    expect(category.getChanges({ name: 'Otro', description: 'Pagos' })).toEqual({ name: 'Otro' })
  })

  it('una descripción vacía se envía como null para borrarla', () => {
    expect(category.getChanges({ name: 'Fornecedor', description: '' })).toEqual({
      description: null,
    })
  })

  it('nunca envía name en null', () => {
    expect(() => category.getChanges({ name: '  ' })).toThrow(InvalidCategoryError)
  })
})

describe('CategorySummaryEntity', () => {
  const build = (transactionsCount: number) =>
    new CategorySummaryEntity({
      id: 'c1',
      name: 'Receita',
      description: null,
      transactionsCount,
      totalEntradas: 0,
      totalSaidas: 0,
    })

  it('solo se puede eliminar sin transacciones', () => {
    expect(build(0).canBeDeleted()).toBe(true)
    expect(build(1).canBeDeleted()).toBe(false)
  })
})

import { InvalidCategoryError } from '@/modules/category/domain/errors'

const MAX_LENGTH = 120

export class CategoryName {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): CategoryName {
    const trimmed = value.trim()
    if (!trimmed) throw new InvalidCategoryError('El nombre es obligatorio')
    if (trimmed.length > MAX_LENGTH) {
      throw new InvalidCategoryError(`El nombre no puede superar ${MAX_LENGTH} caracteres`)
    }
    return new CategoryName(trimmed)
  }

  toString() {
    return this.value
  }
}

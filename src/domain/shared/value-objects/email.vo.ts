import { InvalidEmailError } from '@/domain/shared/errors'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Email {
    const normalized = value.trim().toLowerCase()
    if (!EMAIL_PATTERN.test(normalized)) {
      throw new InvalidEmailError(`Email inválido: ${value}`)
    }
    return new Email(normalized)
  }

  toString() {
    return this.value
  }

  equals(other: Email) {
    return this.value === other.value
  }
}

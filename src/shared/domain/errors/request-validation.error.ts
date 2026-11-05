import { DomainError } from './domain.error'

export class RequestValidationError extends DomainError {
  readonly code = 'REQUEST_VALIDATION'
  readonly messages: string[]

  constructor(messages: string[]) {
    super(messages.join(', '))
    this.messages = messages
  }
}

export interface DomainError {
  readonly message: string
  readonly error?: any
}

export class InvalidCredentialsError extends Error implements DomainError {
  readonly message: string

  constructor() {
    super('DomainError')
    this.name = 'InvalidCredentialsError'
    this.message = 'E-mail or password is invalid'
  }
}

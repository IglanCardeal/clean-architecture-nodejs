export interface DomainError {
  readonly message: string
  readonly error?: any
}

export class InvalidCredentialsError implements DomainError {
  readonly message: string

  constructor() {
    this.message = 'E-mail or password is invalid'
  }
}

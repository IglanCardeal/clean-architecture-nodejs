export interface DomainError {
  readonly message: string
  readonly error?: any
}

export class AccountNotFoundError implements DomainError {
  readonly message: string

  constructor() {
    this.message = 'Account not found'
  }
}

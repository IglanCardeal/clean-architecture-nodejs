import { ApplicationError, Either } from '@src/shared'

export class RepositoryError extends Error implements ApplicationError {
  readonly message: string

  constructor(readonly error?: any) {
    super('AddAccountRepositoryError')
    this.message = 'A repository error ocurred'
  }
}

export class HasherError extends Error implements ApplicationError {
  readonly message: string

  constructor(readonly error?: any) {
    super('HasherError')
    this.message = 'A hasher error ocurred'
  }
}

export class TokenEncrypterError extends Error implements ApplicationError {
  readonly message: string

  constructor(readonly error?: any) {
    super('TokenEncrypterError')
    this.message = 'A token encryption error ocurred'
  }
}

export type DbAuthenticationUseCaseResult = Either<
  string,
  RepositoryError | HasherError | TokenEncrypterError
>

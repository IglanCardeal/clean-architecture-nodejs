import { ApplicationError, Either } from '@src/shared'
import { InvalidCredentialsError } from '@src/domain/errors'

export class LoadAccountByEmailRepositoryError
  extends Error
  implements ApplicationError
{
  readonly message: string

  constructor(readonly stack?: string) {
    super('LoadAccountByEmailRepositoryError')
    this.message = 'A repository error ocurred while loading account by email'
    this.stack = stack
  }
}

export class HasherComparerError extends Error implements ApplicationError {
  readonly message: string

  constructor(readonly stack?: string) {
    super('HasherComparerError')
    this.message = 'A hasher error ocurred while comparing hash and password'
    this.stack = stack
  }
}

export type DbAuthenticationUseCaseResult = Either<
  string,
  | LoadAccountByEmailRepositoryError
  | HasherComparerError
  | InvalidCredentialsError
>

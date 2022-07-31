import { ApplicationError, Either } from '@src/shared'

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

export type DbAuthenticationUseCaseResult = Either<
  string,
  LoadAccountByEmailRepositoryError
>

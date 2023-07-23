import { InvalidAccountTokenOrRoleError } from '@src/domain/errors'
import { ApplicationError, Either } from '@src/shared'
import { AccountModel } from './db-load-account-by-token-protocols'

export class DecrypterError extends Error implements ApplicationError {
  readonly message: string

  constructor(readonly stack?: string) {
    super('DecrypterError')
    this.message = 'A decrypter error ocurred while loading account by token'
    this.stack = stack
  }
}

export class LoadAccountByTokenRepositoryError
  extends Error
  implements ApplicationError
{
  readonly message: string

  constructor(readonly stack?: string) {
    super('LoadAccountByTokenRepositoryError')
    this.message = 'A repository error ocurred while loading account by token'
    this.stack = stack
  }
}

export type DbLoadAccountByTokenUsecaseResult = Either<
  AccountModel,
  | DecrypterError
  | LoadAccountByTokenRepositoryError
  | InvalidAccountTokenOrRoleError
>

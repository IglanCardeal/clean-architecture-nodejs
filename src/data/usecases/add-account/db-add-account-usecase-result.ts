import { AccountModel } from './db-add-account-usecase-protocols'
import { ApplicationError, Either } from '@src/shared'
import { EmailAlreadyInUseError } from '@src/domain/errors'

export class HasherError extends Error implements ApplicationError {
  readonly message: string

  constructor(readonly error?: any) {
    super('HasherError')
    this.message = 'A hasher error ocurred'
  }
}

export class AddAccountRepositoryError
  extends Error
  implements ApplicationError
{
  readonly message: string

  constructor(readonly error?: any) {
    super('AddAccountRepositoryError')
    this.message = 'A repository error ocurred'
  }
}

export class LoadAccountByEmailRepositoryError
  extends Error
  implements ApplicationError
{
  readonly message: string

  constructor(readonly error?: any) {
    super('LoadAccountByEmailRepositoryError')
    this.message = 'A repository error ocurred'
  }
}

export type DbAddAccountResult = Either<
  AccountModel,
  | EmailAlreadyInUseError
  | LoadAccountByEmailRepositoryError
  | AddAccountRepositoryError
  | HasherError
>

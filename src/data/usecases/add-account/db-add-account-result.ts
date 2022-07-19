import { AccountModel } from './db-add-account-protocols'
import { ApplicationError, Either } from '@src/shared'

export class HasherError implements ApplicationError {
  readonly message: string

  constructor(readonly error?: any) {
    this.message = 'A hasher error ocurred'
  }
}

export class AddAccountRepositoryError implements ApplicationError {
  readonly message: string

  constructor(readonly error?: any) {
    this.message = 'A repository error ocurred'
  }
}

export type DbAddAccountResult = Either<
  AccountModel,
  AddAccountRepositoryError | HasherError
>

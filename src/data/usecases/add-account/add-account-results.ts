import { AccountModel } from './db-add-account-protocols'
import { ApplicationError, Either } from '@src/shared'

export class DatabaseError implements ApplicationError {
  readonly message: string

  constructor(readonly error?: any) {
    this.message = 'A database error ocurred'
  }
}

export class HasherError implements ApplicationError {
  readonly message: string

  constructor(readonly error?: any) {
    this.message = 'A hasher error ocurred'
  }
}

export type DbAddAccountResult = Either<
  AccountModel,
  DatabaseError | HasherError
>

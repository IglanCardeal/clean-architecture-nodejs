import { AccountModel } from '@src/domain/models/account'
import { ApplicationError } from '@src/shared/core/errors'
import { Either } from '@src/shared/either'

export class DatabaseError implements ApplicationError {
  readonly message: string

  constructor(readonly error: any) {
    this.message = 'A database error ocurred'
  }
}

export type DbAddAccountResult = Either<AccountModel, DatabaseError>

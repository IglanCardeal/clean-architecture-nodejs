import { DbAddAccountUseCase } from '@src/data/usecases/add-account/db-add-account-usecase'
import { DbAddAccountResult } from '@src/data/usecases/add-account/db-add-account-usecase-result'
import { AddAccountUseCase } from '@src/domain/usecases/add-account'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb'
import { ENV } from '@src/main/config/env'

export const makeDbAddAccountUseCase =
  (): AddAccountUseCase<DbAddAccountResult> => {
    const { bcryptSalt } = ENV
    const hasher = new BcryptAdapter(bcryptSalt)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAddAccountUseCase(
      hasher,
      accountMongoRepository,
      accountMongoRepository
    )
  }

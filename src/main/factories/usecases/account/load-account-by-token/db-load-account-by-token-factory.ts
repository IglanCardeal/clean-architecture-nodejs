import { DbLoadAccountByTokenUsecase } from '@src/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { DbLoadAccountByTokenUsecaseResult } from '@src/data/usecases/account/load-account-by-token/db-load-account-by-token-result'
import { LoadAccountByTokenUseCase } from '@src/domain/usecases/account/load-account-by-token'
import { TokenGeneratorAdapter } from '@src/infra/crypto/jwt/jwt-adpter'
import { AccountMongoRepository } from '@src/infra/db/mongodb'
import { ENV } from '@src/main/config/env'

export const makeDbLoadAccountByTokenUsecase =
  (): LoadAccountByTokenUseCase<DbLoadAccountByTokenUsecaseResult> => {
    const { jwtSecret } = ENV
    const tokenGeneratorAdapter = new TokenGeneratorAdapter(jwtSecret)
    const accountRepository = new AccountMongoRepository()
    return new DbLoadAccountByTokenUsecase(
      tokenGeneratorAdapter,
      accountRepository
    )
  }

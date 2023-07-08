import { DbAuthenticationUseCase } from '@src/data/usecases/authentication/db-authentication-usecase'
import { DbAuthenticationUseCaseResult } from '@src/data/usecases/authentication/db-authentication-usecase-result'
import { AuthenticationUseCase } from '@src/domain/usecases/account'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt/bcrypt-adapter'
import { TokenGeneratorAdapter } from '@src/infra/crypto/jwt/jwt-adpter'
import { AccountMongoRepository } from '@src/infra/db/mongodb'
import { ENV } from '@src/main/config/env'

export const makeDbAuthenticationUseCase =
  (): AuthenticationUseCase<DbAuthenticationUseCaseResult> => {
    const { bcryptSalt, jwtSecret } = ENV
    const hasherAdapter = new BcryptAdapter(bcryptSalt)
    const accountRepository = new AccountMongoRepository()
    const tokenGeneratorAdapter = new TokenGeneratorAdapter(jwtSecret)
    return new DbAuthenticationUseCase(
      accountRepository,
      hasherAdapter,
      tokenGeneratorAdapter,
      accountRepository
    )
  }

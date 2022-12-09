import { ENV } from '@src/main/config/env'
import { DbAuthenticationUseCase } from '@src/data/usecases/authentication/db-authentication-usecase'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt/bcrypt-adapter'
import { TokenGeneratorAdapter } from '@src/infra/crypto/jwt/jwt-adpter'
import { UUIDGeneratorAdapter } from '@src/infra/crypto/uuid/uuid-generator-adapter'
import {
  AccountMongoRepository,
  LogMongoRepository
} from '@src/infra/db/mongodb'
import { LogControllerDecorator } from '@src/main/decorators/log-controller-decorator'
import { LoginController } from '@src/presentation/controllers/login/login-controller'
import { Controller } from '@src/presentation/protocols'
import { makeLoginValidations } from './login-validations-factory'

export const makeLoginController = (): Controller => {
  const { bcryptSalt, jwtSecret } = ENV
  const hasherAdapter = new BcryptAdapter(bcryptSalt)
  const loginValidations = makeLoginValidations()
  const accountRepository = new AccountMongoRepository()
  const tokenGeneratorAdapter = new TokenGeneratorAdapter(jwtSecret)
  const authUseCase = new DbAuthenticationUseCase(
    accountRepository,
    hasherAdapter,
    tokenGeneratorAdapter,
    accountRepository
  )
  const loginController = new LoginController(loginValidations, authUseCase)
  const logMongoRepository = new LogMongoRepository()
  const uuidGenerator = new UUIDGeneratorAdapter()
  return new LogControllerDecorator(
    loginController,
    logMongoRepository,
    uuidGenerator
  )
}

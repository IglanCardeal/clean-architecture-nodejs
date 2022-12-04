import { DbAddAccountUseCase } from '@src/data/usecases/add-account/db-add-account'
import { SignUpController } from '@src/presentation/controllers/signup/signup-controller'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account/account-mongo-repository'
import { LogControllerDecorator } from '../../decorators/log'
import { LogMongoRepository } from '@src/infra/db/mongodb/log/log-mongo-repository'
import { makeSignUpValidations } from './signup-validations'
import { UUIDGeneratorAdapter } from '@src/infra/crypto/uuid/uuid-generator-adapter'

export const makeSignUpController = () => {
  const SALT = 12
  const hasher = new BcryptAdapter(SALT)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccountUseCase = new DbAddAccountUseCase(
    hasher,
    accountMongoRepository
  )
  const signUpValidations = makeSignUpValidations()
  const signUpController = new SignUpController(
    signUpValidations,
    addAccountUseCase
  )
  const logMongoRepository = new LogMongoRepository()
  const uuidGenerator = new UUIDGeneratorAdapter()
  return new LogControllerDecorator(
    signUpController,
    logMongoRepository,
    uuidGenerator
  )
}

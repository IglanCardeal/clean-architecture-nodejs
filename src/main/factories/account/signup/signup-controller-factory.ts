import { ENV } from '@src/main/config/env'
import { DbAddAccountUseCase } from '@src/data/usecases/add-account/db-add-account-usecase'
import { SignUpController } from '@src/presentation/controllers/signup/signup-controller'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt/bcrypt-adapter'
import { UUIDGeneratorAdapter } from '@src/infra/crypto/uuid/uuid-generator-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb'
import { LogMongoRepository } from '@src/infra/db/mongodb'
import { makeSignUpValidations } from './signup-validations-factory'
import { LogControllerDecorator } from '@src/main/decorators/log-controller-decorator'

export const makeSignUpController = () => {
  const { bcryptSalt } = ENV
  const hasher = new BcryptAdapter(bcryptSalt)
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

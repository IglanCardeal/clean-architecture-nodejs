import { DbAddAccountUseCase } from '@src/data/usecases/add-account/db-add-account-usecase'
import { SignUpController } from '@src/presentation/controllers/signup/signup-controller'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt/bcrypt-adapter'
import { UUIDGeneratorAdapter } from '@src/infra/crypto/uuid/uuid-generator-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb'
import { LogMongoRepository } from '@src/infra/db/mongodb'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidations } from './signup-validations-factory'

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

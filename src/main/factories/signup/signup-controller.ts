import { DbAddAccountUseCase } from '@src/data/usecases/add-account/db-add-account'
import { SignUpController } from '@src/presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '@src/utils/email-validator-adapter'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../../decorators/log'
import { LogMongoRepository } from '@src/infra/db/mongodb/log-repository/log'
import { makeSignUpValidations } from './signup-validations'

export const makeSignUpController = () => {
  const SALT = 12
  const hasher = new BcryptAdapter(SALT)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccountUseCase = new DbAddAccountUseCase(
    hasher,
    accountMongoRepository
  )
  const signUpValidations = makeSignUpValidations()
  const emailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(
    emailValidator,
    signUpValidations,
    addAccountUseCase
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}

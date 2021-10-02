import { AddAccountService } from '@src/modules/account/usecases/signup/add-account'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt-adapter'
import { AccountRepository } from '@src/infra/database/mongodb/account/account-repository'
import { SignUpController } from '@src/modules/account/usecases/signup/signup-controller'
import { EmailValidatorAdapter } from '@src/utils/email-validator-adapter'
import { LogControllerDecorator } from '../../infra/decorators/log'
import { LogErrorMongoRepository } from '@src/infra/database/mongodb/log/log-repository'

export const makeSignUpController = () => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const encrypterAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountRepository()
  const addAccountUsecase = new AddAccountService(
    encrypterAdapter,
    addAccountRepository
  )
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    addAccountUsecase
  )
  const logErrorMongoRepository = new LogErrorMongoRepository()

  return new LogControllerDecorator(signUpController, logErrorMongoRepository)
}

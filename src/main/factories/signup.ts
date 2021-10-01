import { DbAddAccount } from '@src/modules/account/usecases/signup/db-add-account'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt-adapter'
import { AccountRepository } from '@src/infra/database/mongodb/account/account-repository'
import { SignUpController } from '@src/modules/account/usecases/signup/signup-controller'
import { EmailValidatorAdapter } from '@src/utils/email-validator-adapter'

export const makeSignUpController = () => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const encrypterAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountRepository()
  const addAccountUsecase = new DbAddAccount(
    encrypterAdapter,
    addAccountRepository
  )
  return new SignUpController(emailValidatorAdapter, addAccountUsecase)
}

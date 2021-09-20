import { DbAddAccount } from '@src/data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt-adapter'
import { AccountRepository } from '@src/infra/database/mongodb/account/account-repository'
import { SignUpController } from '@src/presentation/controllers/signup/signup-controller'
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

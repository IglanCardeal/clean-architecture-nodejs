import { DbAddAccountUseCase } from '@src/data/usecases/add-account/db-add-account'
import { SignUpController } from '@src/presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '@src/utils/email-validator-adapter'
import { BcryptAdapter } from '@src/infra/crypto/bcrypt-adapter'
import { AccountMongoRepository } from '@src/infra/db/mongodb/account-repository/account'

export const makeSignUpController = () => {
  const SALT = 12
  const hasher = new BcryptAdapter(SALT)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccountUseCase = new DbAddAccountUseCase(
    hasher,
    accountMongoRepository
  )
  const emailValidator = new EmailValidatorAdapter()
  return new SignUpController(emailValidator, addAccountUseCase)
}

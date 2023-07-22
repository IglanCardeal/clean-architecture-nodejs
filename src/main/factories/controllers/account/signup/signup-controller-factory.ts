import { SignUpController } from '@src/presentation/controllers/account/signup/signup-controller'
import { makeSignUpValidations } from './signup-validations-factory'
import { makeDbAuthenticationUseCase } from '@src/main/factories/usecases/account/add-account/db-add-account-usescase-factory'
import { makeLogControllerDecorator } from '@src/main/factories/controllers/decorators/log-controller-decorator-factory'
import { makeDbAddAccountUseCase } from '@src/main/factories/usecases/account/authentication/db-authentication-usecase-factory'

export const makeSignUpController = () => {
  const signUpController = new SignUpController(
    makeSignUpValidations(),
    makeDbAddAccountUseCase(),
    makeDbAuthenticationUseCase()
  )
  return makeLogControllerDecorator(signUpController)
}

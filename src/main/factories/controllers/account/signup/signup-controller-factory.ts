import { SignUpController } from '@src/presentation/controllers/signup/signup-controller'
import { makeSignUpValidations } from './signup-validations-factory'
import { makeDbAddAccountUseCase } from '@src/main/factories/usecases/authentication/db-authentication-usecase-factory'
import { makeDbAuthenticationUseCase } from '@src/main/factories/usecases/add-account/db-add-account-usescase-factory'
import { makeLogControllerDecorator } from '@src/main/factories/controllers/decorators/log-controller-decorator-factory'

export const makeSignUpController = () => {
  const signUpController = new SignUpController(
    makeSignUpValidations(),
    makeDbAddAccountUseCase(),
    makeDbAuthenticationUseCase()
  )
  return makeLogControllerDecorator(signUpController)
}

import { makeDbAuthenticationUseCase } from '@src/main/factories/usecases/account/add-account/db-add-account-usescase-factory'
import { LoginController } from '@src/presentation/controllers/account/login/login-controller'
import { Controller } from '@src/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeLoginValidations } from './login-validations-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeLoginValidations(),
    makeDbAuthenticationUseCase()
  )
  return makeLogControllerDecorator(loginController)
}

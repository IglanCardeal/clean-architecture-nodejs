import { DbAuthenticationUseCaseResult } from '@src/data/usecases/authentication/db-authentication-usecase-result'
import { InvalidCredentialsError } from '@src/domain/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@src/presentation/helpers/http'
import {
  Controller,
  Validation,
  HttpRequest,
  HttpResponse,
  AuthenticationUseCase
} from './login-controller-protocols'
export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authenticationUseCase: AuthenticationUseCase<DbAuthenticationUseCaseResult>
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body
      const result = await this.authenticationUseCase.auth({
        email,
        password
      })

      if (result.isFailure()) {
        const { error } = result
        switch (error.constructor) {
          case InvalidCredentialsError:
            return unauthorized(error)
          default:
            return serverError(error)
        }
      }

      const { token } = result.data

      return ok({ accessToken: token })
    } catch (error: any) {
      return serverError(error)
    }
  }
}

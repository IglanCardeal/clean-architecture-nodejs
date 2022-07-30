import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@src/presentation/helpers/http-helper'
import {
  Controller,
  Validation,
  HttpRequest,
  HttpResponse,
  AuthenticationUseCase
} from './login-protocols'
export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authenticationUseCase: AuthenticationUseCase<string>
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.authenticationUseCase.auth({
        email,
        password
      })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }
}

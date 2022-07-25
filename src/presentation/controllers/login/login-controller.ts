import { InvalidParamError, MissingParamError } from '@src/presentation/errors'
import { badRequest, serverError } from '@src/presentation/helpers/http-helper'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  AuthenticationUseCase
} from './login-protocols'
export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authenticationUseCase: AuthenticationUseCase<string>
  ) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httRequest.body

      const isValidEmail = this.emailValidator.isValid(email)

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authenticationUseCase.auth({ email, password })

      return {} as any
    } catch (error: any) {
      return serverError(error)
    }
  }
}

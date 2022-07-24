import { MissingParamError } from '@src/presentation/errors'
import { badRequest } from '@src/presentation/helpers/http-helper'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from './login-protocols'
export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = httRequest.body

    this.emailValidator.isValid(email)

    return {} as any
  }
}

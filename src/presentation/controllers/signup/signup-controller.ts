import { MissingParamError, InvalidParamError } from '@src/presentation/errors'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  AddAccount,
  HttpResponse
} from './signup-protocolos'
import {
  badRequest,
  serverError,
  ok
} from '@src/presentation/helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  public handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)
      const passwordsAreEqual = password === passwordConfirmation

      if (!passwordsAreEqual) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}

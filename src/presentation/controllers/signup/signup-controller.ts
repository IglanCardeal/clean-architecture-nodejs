import { AddAccount } from '@src/domain/usecases/add-account'
import { MissingParamError, InvalidParamError } from '@src/presentation/errors'

import {
  badRequest,
  serverError,
  ok
} from '@src/presentation/helpers/http-helper'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '@src/presentation/ports'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.add({
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

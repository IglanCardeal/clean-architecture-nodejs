import { MissingParamError, InvalidParamError } from '@src/presentation/errors'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  AddAccountUseCase,
  HttpResponse,
  AccountModel
} from './signup-protocols'
import {
  badRequest,
  serverError,
  created
} from '@src/presentation/helpers/http-helper'
import { DbAddAccountResult } from '@src/data/usecases/add-account/db-add-account-result'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccountUseCase: AddAccountUseCase<DbAddAccountResult>
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const passwordsAreEqual = password === passwordConfirmation

      if (!passwordsAreEqual) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(email)

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccountUseCase.add({
        name,
        email,
        password
      })

      if (account.isFailure()) {
        return serverError(account.error)
      }

      return created<AccountModel>(account.data)
    } catch (error: any) {
      return serverError(error)
    }
  }
}

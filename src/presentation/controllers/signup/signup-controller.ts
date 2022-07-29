import {
  Controller,
  HttpRequest,
  AddAccountUseCase,
  HttpResponse,
  AccountModel,
  Validation
} from './signup-protocols'
import {
  badRequest,
  serverError,
  created
} from '@src/presentation/helpers/http-helper'
import { DbAddAccountResult } from '@src/data/usecases/add-account/db-add-account-result'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addAccountUseCase: AddAccountUseCase<DbAddAccountResult>
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
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

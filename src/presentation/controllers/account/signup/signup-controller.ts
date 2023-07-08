import {
  Controller,
  HttpRequest,
  AddAccountUseCase,
  HttpResponse,
  Validation,
  AuthenticationUseCase
} from './signup-controller-protocols'
import {
  badRequest,
  serverError,
  created,
  conflict
} from '@src/presentation/helpers/http'
import {
  AddAccountRepositoryError,
  DbAddAccountResult,
  HasherError,
  LoadAccountByEmailRepositoryError
} from '@src/data/usecases/account/add-account/db-add-account-usecase-result'
import { EmailAlreadyInUseError } from '@src/domain/errors'
import { DbAuthenticationUseCaseResult } from '@src/data/usecases/account/authentication/db-authentication-usecase-result'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addAccountUseCase: AddAccountUseCase<DbAddAccountResult>,
    private readonly authenticationUseCase: AuthenticationUseCase<DbAuthenticationUseCaseResult>
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)

      if (validationError) {
        return badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body
      const addAccountUseCaseResult = await this.addAccountUseCase.add({
        name,
        email,
        password
      })

      if (addAccountUseCaseResult.isFailure()) {
        return this.handleFailure(addAccountUseCaseResult.error)
      }

      const authenticationUseCaseResult = await this.authenticationUseCase.auth(
        { email, password }
      )

      if (authenticationUseCaseResult.isFailure()) {
        return this.handleFailure(authenticationUseCaseResult.error)
      }

      const { token: accessToken } = authenticationUseCaseResult.data

      return created({
        accessToken
      })
    } catch (error: any) {
      return serverError(error)
    }
  }

  private handleFailure(
    error:
      | EmailAlreadyInUseError
      | LoadAccountByEmailRepositoryError
      | AddAccountRepositoryError
      | HasherError
  ): HttpResponse {
    switch (error.constructor) {
      case EmailAlreadyInUseError:
        return conflict(error)
      default:
        return serverError(error)
    }
  }
}

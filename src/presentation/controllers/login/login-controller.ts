import {
  DbAuthenticationUseCaseResult,
  HasherComparerError,
  LoadAccountByEmailRepositoryError,
  TokenGeneratorError,
  UpdateAccessTokenRepositoryError
} from '@src/data/usecases/authentication/db-authentication-usecase-result'
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
      const validationError = this.validation.validate(httpRequest.body)

      if (validationError) {
        return badRequest(validationError)
      }

      const { email, password } = httpRequest.body
      const authenticationUseCaseResult = await this.authenticationUseCase.auth(
        {
          email,
          password
        }
      )

      if (authenticationUseCaseResult.isFailure()) {
        return this.handleFailure(authenticationUseCaseResult.error)
      }

      const { token } = authenticationUseCaseResult.data

      return ok({ accessToken: token })
    } catch (error: any) {
      return serverError(error)
    }
  }

  private handleFailure(
    error:
      | InvalidCredentialsError
      | LoadAccountByEmailRepositoryError
      | UpdateAccessTokenRepositoryError
      | HasherComparerError
      | TokenGeneratorError
  ): HttpResponse {
    switch (error.constructor) {
      case InvalidCredentialsError:
        return unauthorized(error)
      default:
        return serverError(error)
    }
  }
}

import {
  HttpRequest,
  HttpResponse,
  Middleware,
  LoadAccountByTokenUseCase,
  DbLoadAccountByTokenUsecaseResult
} from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
import { AccessDeniedError } from '@src/presentation/errors'
import { InvalidAccountTokenOrRoleError } from '@src/domain/errors'
import {
  DecrypterError,
  LoadAccountByTokenRepositoryError
} from '@src/data/usecases/load-account-by-token/db-load-account-by-token-result'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase<DbLoadAccountByTokenUsecaseResult>,
    private readonly role?: string
  ) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httRequest.headers?.['x-access-token']

      if (!accessToken) {
        return forbidden(new AccessDeniedError())
      }

      const loadAccountByTokenUseCaseResult =
        await this.loadAccountByTokenUseCase.load({
          accessToken,
          role: this.role
        })

      if (loadAccountByTokenUseCaseResult.isFailure()) {
        return this.handleError(loadAccountByTokenUseCaseResult.error)
      }

      const { id: accountId } = loadAccountByTokenUseCaseResult.data

      return ok({
        accountId
      })
    } catch (error: any) {
      return serverError(error)
    }
  }

  private handleError(
    error:
      | DecrypterError
      | LoadAccountByTokenRepositoryError
      | InvalidAccountTokenOrRoleError
  ) {
    if (error instanceof LoadAccountByTokenRepositoryError) {
      return serverError(error)
    }
    return forbidden(error)
  }
}

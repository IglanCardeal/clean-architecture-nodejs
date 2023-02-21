import {
  HttpRequest,
  HttpResponse,
  Middleware,
  LoadAccountByTokenUseCase,
  AccountModel
} from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
import { AccessDeniedError } from '@src/presentation/errors'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase<
      AccountModel | AccessDeniedError
    >,
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

      if (loadAccountByTokenUseCaseResult instanceof AccessDeniedError) {
        return forbidden(new AccessDeniedError())
      }

      return ok({
        accountId: loadAccountByTokenUseCaseResult.id
      })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
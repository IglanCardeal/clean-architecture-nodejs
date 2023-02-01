import {
  HttpRequest,
  HttpResponse,
  Middleware,
  LoadAccountByTokenUseCase,
  AccountModel
} from './auth-middleware-protocols'
import { forbidden, ok } from '@src/presentation/helpers/http'
import { AccessDeniedError } from '@src/presentation/errors'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase<
      AccountModel | AccessDeniedError
    >
  ) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httRequest.headers?.['x-access-token']

    if (!accessToken) {
      return forbidden(new AccessDeniedError())
    }

    const loadAccountByTokenUseCaseResult =
      await this.loadAccountByTokenUseCase.load({ accessToken })

    if (loadAccountByTokenUseCaseResult instanceof AccessDeniedError) {
      return forbidden(new AccessDeniedError())
    }

    return ok({
      accountId: loadAccountByTokenUseCaseResult.id
    })
  }
}

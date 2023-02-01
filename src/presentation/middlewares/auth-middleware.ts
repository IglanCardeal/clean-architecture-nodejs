import {
  HttpRequest,
  HttpResponse,
  Middleware,
  LoadAccountByTokenUseCase,
  AccountModel
} from './auth-middleware-protocols'
import { forbidden } from '@src/presentation/helpers/http'
import { AccessDeniedError } from '@src/presentation/errors'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase<AccountModel>
  ) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httRequest.headers?.['x-access-token']

    if (!accessToken) {
      return forbidden(new AccessDeniedError())
    }

    await this.loadAccountByTokenUseCase.load({ accessToken })

    return <any>{}
  }
}

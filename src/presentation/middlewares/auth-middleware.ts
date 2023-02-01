import {
  HttpRequest,
  HttpResponse,
  Middleware
} from '@src/presentation/protocols'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http'

export class AuthMiddleware implements Middleware {
  async handle(_httRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}

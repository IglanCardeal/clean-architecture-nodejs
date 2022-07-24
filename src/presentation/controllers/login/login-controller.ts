import { MissingParamError } from '@src/presentation/errors'
import { badRequest } from '@src/presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../signup/signup-protocols'

export class LoginController implements Controller {
  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {} as any
  }
}

import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@src/presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    return await this.controller.handle(httRequest)
  }
}

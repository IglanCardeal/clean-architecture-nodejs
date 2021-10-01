import { Controller, HttpRequest, HttpResponse } from '@src/shared/ports'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      // log
    }

    return httpResponse
  }
}

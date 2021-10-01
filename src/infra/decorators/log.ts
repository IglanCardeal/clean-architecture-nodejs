import { Controller, HttpRequest, HttpResponse } from '@src/shared/ports'
import { LogErrorRepository } from '@src/shared/ports/log-repository'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      this.logErrorRepository.log(httpResponse.body.stack)
    }

    return httpResponse
  }
}

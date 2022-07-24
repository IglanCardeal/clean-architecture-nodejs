import {
  Controller,
  HttpRequest,
  HttpResponse,
  LogErrorRepository
} from '@src/presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack)
    }
    return httpResponse
  }
}

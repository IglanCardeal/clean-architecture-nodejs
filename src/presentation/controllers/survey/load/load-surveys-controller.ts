import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyUseCase
} from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveyUseCase: LoadSurveyUseCase) {}

  async handle(_httRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyUseCase.load()
    return {} as any
  }
}

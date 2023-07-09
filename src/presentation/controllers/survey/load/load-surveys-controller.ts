import { ok } from '@src/presentation/helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyUseCase
} from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveyUseCase: LoadSurveyUseCase) {}

  async handle(_httRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveyUseCase.load()
    return ok(surveys)
  }
}

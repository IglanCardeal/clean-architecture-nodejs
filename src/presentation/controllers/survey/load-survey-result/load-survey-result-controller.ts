import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyResultUseCase
} from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyResultUseCase: LoadSurveyResultUseCase
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = request.params
    await this.loadSurveyResultUseCase.load(surveyId)
    return null as any
  }
}

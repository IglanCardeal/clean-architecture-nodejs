import { forbidden } from '@src/presentation/helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyResultUseCase
} from './load-survey-result-controller-protocols'
import { InvalidParamError } from '@src/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyResultUseCase: LoadSurveyResultUseCase
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = request.params

    const surveyResult = await this.loadSurveyResultUseCase.load(surveyId)

    if (!surveyResult) return forbidden(new InvalidParamError('surveyId'))

    return null as any
  }
}

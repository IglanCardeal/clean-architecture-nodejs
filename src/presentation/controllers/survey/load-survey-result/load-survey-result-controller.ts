import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
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
    try {
      const { surveyId } = request.params

      const surveyResult = await this.loadSurveyResultUseCase.load(surveyId)

      if (!surveyResult) return forbidden(new InvalidParamError('surveyId'))

      return ok(surveyResult)
    } catch (error: any) {
      return serverError(error)
    }
  }
}

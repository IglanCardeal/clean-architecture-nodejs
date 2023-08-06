import { badRequest } from '@src/presentation/helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyByIdUseCase
} from './save-survey-result-controller-protocols'
import { MissingSurveyId } from '@src/domain/errors'

export type Body = {
  surveyId: string
}

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyByIdUseCase: LoadSurveyByIdUseCase) {}

  async handle(httpRequest: HttpRequest<Body, never>): Promise<HttpResponse> {
    const { surveyId } = httpRequest.body || {}

    if (!surveyId) {
      return badRequest(new MissingSurveyId())
    }

    return {} as any
  }
}

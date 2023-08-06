import {
  badRequest,
  forbidden,
  serverError
} from '@src/presentation/helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyByIdUseCase
} from './save-survey-result-controller-protocols'
import { InvalidParamError, MissingParamError } from '@src/presentation/errors'

export type Body = {
  surveyId: string
  answer: string
}

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyByIdUseCase: LoadSurveyByIdUseCase) {}

  async handle(httpRequest: HttpRequest<Body, never>): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.body || {}

      if (!surveyId) {
        return badRequest(new MissingParamError('survey id'))
      }

      const survey = await this.loadSurveyByIdUseCase.loadById(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('survey id'))
      }

      return {} as any
    } catch (error: any) {
      return serverError(error)
    }
  }
}

import { forbidden, serverError } from '@src/presentation/helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyByIdUseCase
} from './save-survey-result-controller-protocols'
import { InvalidParamError } from '@src/presentation/errors'

export type Body = {
  surveyId: string
  answer: string
}

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyByIdUseCase: LoadSurveyByIdUseCase) {}

  async handle(httpRequest: HttpRequest<Body, never>): Promise<HttpResponse> {
    try {
      const { surveyId, answer } = httpRequest.body as Body

      const survey = await this.loadSurveyByIdUseCase.loadById(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('survey id'))
      }

      const surveyAnswers = survey.answers.map((ans) => ans.answer)
      const isInvalidAnswer = !surveyAnswers.includes(answer)

      if (isInvalidAnswer) {
        return forbidden(new InvalidParamError('answer'))
      }

      return {} as any
    } catch (error: any) {
      return serverError(error)
    }
  }
}
import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyByIdUseCase,
  SaveSurveyResultModel,
  SaveSurveyResultUseCase,
  SurveyResultModel
} from './save-survey-result-controller-protocols'
import { InvalidParamError } from '@src/presentation/errors'

export type Body = {
  surveyId: string
  answer: string
}

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyByIdUseCase: LoadSurveyByIdUseCase,
    private readonly saveSurveyResultUseCase: SaveSurveyResultUseCase
  ) {}

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

      const accountId = httpRequest.accountId as string
      const data: SaveSurveyResultModel = {
        accountId,
        answer,
        surveyId,
        date: new Date()
      }

      const savedSurvey = await this.saveSurveyResultUseCase.save(data)

      return ok<SurveyResultModel>(savedSurvey)
    } catch (error: any) {
      return serverError(error)
    }
  }
}

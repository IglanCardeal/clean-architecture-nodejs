import { SurveyResultModel } from '@src/domain/models/survey-result'

export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResultUseCase {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>
}

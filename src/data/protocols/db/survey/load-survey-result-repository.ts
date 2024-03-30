import { SurveyResultModel } from '@src/domain/models/survey-result'

export interface LoadSurveyResultRepository {
  loadBySurveyId(
    surveyId: string,
    accountId?: string
  ): Promise<SurveyResultModel>
}

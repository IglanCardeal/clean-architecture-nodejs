import { SurveyResultModel } from '@src/domain/models/survey-result'

export interface LoadSurveyResultRepository {
  loadBySurveyId(surveyId: string): Promise<SurveyResultModel>
}

import { SurveyResultModel } from '@src/domain/models/survey-result'

export interface LoadSurveyResultUseCase {
  load(surveyId: string): Promise<SurveyResultModel>
}

import { SurveyResultModel } from '@src/domain/models/survey-result'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey/save-survey-result'

export interface SaveSurveyResultRepository {
  save(survey: SaveSurveyResultParams): Promise<SurveyResultModel>
}

import { SurveyResultModel } from '@src/domain/models/survey-result'
import { SaveSurveyResultModel } from '@src/domain/usecases/survey/save-survey-result'

export interface SaveSurveyResultRepository {
  save(survey: SaveSurveyResultModel): Promise<SurveyResultModel>
}

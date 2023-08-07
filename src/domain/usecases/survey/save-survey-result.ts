import { SurveyResultModel } from '@src/domain/models/survey-result'

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResultUseCase {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>
}

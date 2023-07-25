import { SurveyResultModel } from '@src/domain/models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResultUseCase {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>
}

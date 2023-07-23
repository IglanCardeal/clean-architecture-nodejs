import { SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveyUseCase {
  load(): Promise<SurveyModel[]>
}

import { SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveyByIdUseCase {
  loadById(id: string): Promise<SurveyModel | null>
}

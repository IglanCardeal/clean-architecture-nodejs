import { SurveyModel } from '@src/domain/models/survey'

export interface LoadSurveyByIdRepository {
  load(id: string): Promise<SurveyModel | null>
}

import { SurveyModel } from '@src/domain/models/survey'

export interface ListSurveysRepository {
  getList(): Promise<SurveyModel[]>
}

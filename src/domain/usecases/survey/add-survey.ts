import { SurveyModel } from '../../models/survey'

export interface AddSurveyUseCase<T> {
  add(data: SurveyModel): Promise<T>
}

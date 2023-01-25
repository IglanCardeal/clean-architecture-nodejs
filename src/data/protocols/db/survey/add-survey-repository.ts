import { AddSurveyModel } from '@src/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add(survey: AddSurveyModel): Promise<void>
}

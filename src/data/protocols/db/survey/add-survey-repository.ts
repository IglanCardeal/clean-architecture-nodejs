import { AddSurveyModel } from '@src/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add(survey: AddSurveyModel): Promise<void>
}

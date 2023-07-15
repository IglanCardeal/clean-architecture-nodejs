import { SurveyModel } from "@src/domain/models/survey"

export interface AddSurveyRepository {
  add(survey: SurveyModel): Promise<void>
}

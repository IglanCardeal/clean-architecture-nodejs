import { SaveSurveyResultParams } from '@src/domain/usecases/survey/save-survey-result'

export interface SaveSurveyResultRepository {
  save(survey: SaveSurveyResultParams): Promise<void>
}

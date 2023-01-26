import { failure, success } from '@src/shared'
import {
  AddSurveyModel,
  AddSurveyRepository,
  AddSurveyUseCase
} from './db-add-survey-usecase-protocols'
import {
  AddSurveyRepositoryError,
  DbAddSurveyResult
} from './db-add-survey-usecase-result'

export class DbAddSurveyUseCase implements AddSurveyUseCase<DbAddSurveyResult> {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(survey: AddSurveyModel): Promise<DbAddSurveyResult> {
    try {
      await this.addSurveyRepository.add(survey)
      return success(undefined)
    } catch (error: any) {
      return failure(new AddSurveyRepositoryError(error.stack))
    }
  }
}

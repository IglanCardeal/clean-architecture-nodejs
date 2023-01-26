import { failure, success } from '@src/shared'
import {
  AddSurveyModel,
  AddSurveyRepository,
  AddSurveyUseCase
} from './db-add-survey-usecase-protocols'
import {
  AddSurveyRepositoryError,
  DbAddAccountResult
} from './db-add-survey-usecase-result'

export class DbAddSurveyUseCase
  implements AddSurveyUseCase<DbAddAccountResult>
{
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(survey: AddSurveyModel): Promise<DbAddAccountResult> {
    try {
      await this.addSurveyRepository.add(survey)
      return success(undefined)
    } catch (error: any) {
      return failure(new AddSurveyRepositoryError(error.stack))
    }
  }
}

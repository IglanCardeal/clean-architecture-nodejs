import {
  AddSurveyModel,
  AddSurveyRepository,
  AddSurveyUseCase
} from './db-add-survey-usecase-protocols'

export class DbAddSurveyUseCase implements AddSurveyUseCase<any> {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(survey: AddSurveyModel): Promise<any> {
    await this.addSurveyRepository.add(survey)
    return null
  }
}

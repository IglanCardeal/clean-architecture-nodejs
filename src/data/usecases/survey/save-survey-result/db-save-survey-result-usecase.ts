import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SaveSurveyResultUseCase,
  SurveyResultModel
} from './db-save-survey-result-usecase-protocols'

export class DbSaveSurveyResultUseCase implements SaveSurveyResultUseCase {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    return {} as any
  }
}

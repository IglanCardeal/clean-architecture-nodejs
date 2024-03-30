import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
  SaveSurveyResultUseCase,
  SurveyResultModel
} from './db-save-survey-result-usecase-protocols'

export class DbSaveSurveyResultUseCase implements SaveSurveyResultUseCase {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    return this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
  }
}

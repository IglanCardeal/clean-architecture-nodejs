import {
  LoadSurveyResultRepository,
  SurveyResultModel,
  LoadSurveyResultUseCase
} from './db-load-survey-result-usecase.protocols'

export class DbLoadSurveyResultUseCase implements LoadSurveyResultUseCase {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    return await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
  }
}
import {
  LoadSurveyResultRepository,
  SurveyResultModel,
  LoadSurveyResultUseCase,
  LoadSurveyByIdRepository
} from './db-load-survey-result-usecase.protocols'

export class DbLoadSurveyResultUseCase implements LoadSurveyResultUseCase {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId
    )

    if (!surveyResult) {
      await this.loadSurveyByIdRepository.load(surveyId)
    }

    return {} as any
  }
}

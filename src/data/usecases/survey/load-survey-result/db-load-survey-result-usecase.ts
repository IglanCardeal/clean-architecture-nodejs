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

    if (surveyResult) return surveyResult

    const survey = await this.loadSurveyByIdRepository.load(surveyId)

    if (!survey) return null as any as SurveyResultModel

    return {} as any
  }
}

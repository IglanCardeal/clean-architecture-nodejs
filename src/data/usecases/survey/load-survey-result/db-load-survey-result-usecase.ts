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

    const surveyResultWithCountZero = {
      surveyId: survey.id as string,
      answers: survey.answers.map((answer) => ({
        ...answer,
        count: 0,
        percent: 0
      })),
      date: survey.date,
      question: survey.question
    } as SurveyResultModel

    return surveyResultWithCountZero
  }
}

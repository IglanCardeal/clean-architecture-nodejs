import { LoadSurveyResultUseCase } from '@src/domain/usecases/survey/load-survey-result'
import { SurveyResultModel } from '../save-survey-result/db-save-survey-result-usecase-protocols'
import { LoadSurveyResultRepository } from './db-load-survey-result-usecase.protocols'

export class DbLoadSurveyResultUseCase implements LoadSurveyResultUseCase {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return {} as any
  }
}

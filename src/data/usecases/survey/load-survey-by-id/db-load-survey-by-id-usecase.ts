import { SurveyModel } from '../add-survey/db-add-survey-usecase-protocols'
import {
  LoadSurveyByIdUseCase,
  LoadSurveyByIdRepository
} from './db-load-survey-by-id-usecase-protocols'

export class DbLoadSurveyByIdUseCase implements LoadSurveyByIdUseCase {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(surveyId: string): Promise<SurveyModel | null> {
    await this.loadSurveyByIdRepository.load(surveyId)
    return null
  }
}

import {
  ListSurveysRepository,
  LoadSurveyUseCase,
  SurveyModel
} from './db-load-surveys-usecase-protocols'

export class DbLoadSurveysUseCase implements LoadSurveyUseCase {
  constructor(private readonly listSurveysRepository: ListSurveysRepository) {}

  async load(): Promise<SurveyModel[]> {
    await this.listSurveysRepository.getList()
    return []
  }
}

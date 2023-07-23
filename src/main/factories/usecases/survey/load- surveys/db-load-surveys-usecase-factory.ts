import { DbLoadSurveysUseCase } from '@src/data/usecases/survey/load-surveys/db-load-surveys-usecase'
import { LoadSurveyUseCase } from '@src/domain/usecases/survey'
import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveysUseCase = (): LoadSurveyUseCase => {
  const listSurveysRepository = new SurveyMongoRepository()
  return new DbLoadSurveysUseCase(listSurveysRepository)
}

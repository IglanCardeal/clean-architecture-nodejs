import { DbLoadSurveysUseCase } from '@src/data/usecases/survey/load-surveys/db-load-surveys-usecase'
import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveysUseCase = (): DbLoadSurveysUseCase => {
  const listSurveysRepository = new SurveyMongoRepository()
  return new DbLoadSurveysUseCase(listSurveysRepository)
}

import { DbLoadSurveyByIdUseCase } from '@src/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-usecase'
import { LoadSurveyByIdUseCase } from '@src/domain/usecases/survey'
import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyByIdUseCase = (): LoadSurveyByIdUseCase => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyByIdUseCase(surveyMongoRepository)
}

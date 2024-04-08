import { DbLoadSurveyResultUseCase } from '@src/data/usecases/survey/load-survey-result/db-load-survey-result-usecase'
import { LoadSurveyResultUseCase } from '@src/domain/usecases/survey'
import { SurveyResultMongoRepository } from '@src/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyResultUseCase = (): LoadSurveyResultUseCase => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResultUseCase(
    surveyResultMongoRepository,
    surveyMongoRepository
  )
}

import { DbSaveSurveyResultUseCase } from '@src/data/usecases/survey/save-survey-result/db-save-survey-result-usecase'
import { SaveSurveyResultUseCase } from '@src/domain/usecases/survey'
import { SurveyResultMongoRepository } from '@src/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResultUseCase = (): SaveSurveyResultUseCase => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResultUseCase(surveyResultMongoRepository)
}

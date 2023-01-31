import { DbAddSurveyUseCase } from '@src/data/usecases/add-survey/db-add-survey-usecase'
import { DbAddSurveyResult } from '@src/data/usecases/add-survey/db-add-survey-usecase-result'
import { AddSurveyUseCase } from '@src/domain/usecases/add-survey'
import { SurveyMongoRepository } from '@src/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurveyUseCase =
  (): AddSurveyUseCase<DbAddSurveyResult> => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbAddSurveyUseCase(surveyMongoRepository)
  }

import { makeDbLoadSurveyResultUseCase } from '@src/main/factories/usecases/survey/load-survey-result/db-load-survey-result-usecase-factory'
import { LoadSurveyResultController } from '@src/presentation/controllers/survey/load-survey-result/load-survey-result-controller'
import { Controller } from '@src/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyResultController = new LoadSurveyResultController(
    makeDbLoadSurveyResultUseCase()
  )
  return makeLogControllerDecorator(loadSurveyResultController)
}

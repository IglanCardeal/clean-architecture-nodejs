import { makeLogControllerDecorator } from '@src/main/factories/controllers/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyByIdUseCase } from '@src/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-usecase-factory'
import { makeDbSaveSurveyResultUseCase } from '@src/main/factories/usecases/survey/save-survey-result/db-save-survey-result-usecase-factory'
import { SaveSurveyResultController } from '@src/presentation/controllers/survey/save-survey-result/save-survey-result-controller'
import { Controller } from '@src/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(
    makeDbLoadSurveyByIdUseCase(),
    makeDbSaveSurveyResultUseCase()
  )
  return makeLogControllerDecorator(saveSurveyResultController)
}

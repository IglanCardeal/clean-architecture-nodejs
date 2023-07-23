import { makeDbLoadSurveysUseCase } from '@src/main/factories/usecases/survey/load- surveys/db-load-surveys-usecase-factory'
import { LoadSurveysController } from '@src/presentation/controllers/survey/load/load-surveys-controller'
import { Controller } from '@src/presentation/protocols'
import { makeLogControllerDecorator } from '@src/main/factories/controllers/decorators/log-controller-decorator-factory'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(
    makeDbLoadSurveysUseCase()
  )
  return makeLogControllerDecorator(loadSurveysController)
}

import { makeDbLoadSurveysUseCase } from '@src/main/factories/usecases/survey/load- surveys/db-load-surveys-usecase-factory'
import { LoadSurveysController } from '@src/presentation/controllers/survey/load/load-surveys-controller'

export const makeLoadSurveysController = (): LoadSurveysController => {
  return new LoadSurveysController(makeDbLoadSurveysUseCase())
}

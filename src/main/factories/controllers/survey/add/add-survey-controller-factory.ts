import { AddSurveyController } from '@src/presentation/controllers/survey/add/add-survey-controller'
import { Controller } from '@src/presentation/protocols'
import { makeLogControllerDecorator } from '@src/main/factories/controllers/decorators/log-controller-decorator-factory'
import { makeDbAddSurveyUseCase } from '@src/main/factories/usecases/add-survey/db-add-survey-usecase-factory'
import { makeAddSurveyValidation } from './add-survey-validations-factory'

export const makeAddSurveyController = (): Controller => {
  const loginController = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurveyUseCase()
  )
  return makeLogControllerDecorator(loginController)
}

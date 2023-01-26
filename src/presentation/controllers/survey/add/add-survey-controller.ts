import {
  badRequest,
  noContent,
  serverError
} from '@src/presentation/helpers/http'
import {
  Controller,
  Validation,
  HttpRequest,
  HttpResponse,
  AddSurveyUseCase,
  DbAddSurveyResult
} from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurveyUseCase: AddSurveyUseCase<DbAddSurveyResult>
  ) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httRequest.body)

      if (validationError) {
        return badRequest(validationError)
      }

      const { question, answers } = httRequest.body

      const addSurveyUseCaseResult = await this.addSurveyUseCase.add({
        question,
        answers
      })

      if (addSurveyUseCaseResult.isFailure()) {
        return serverError(addSurveyUseCaseResult.error)
      }

      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}

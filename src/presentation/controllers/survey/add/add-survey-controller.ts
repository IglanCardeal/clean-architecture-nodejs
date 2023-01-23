import { badRequest, serverError } from '@src/presentation/helpers/http'
import {
  Controller,
  Validation,
  HttpRequest,
  HttpResponse,
  AddSurveyUseCase
} from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurveyUseCase: AddSurveyUseCase<any>
  ) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httRequest.body)

      if (validationError) {
        return badRequest(validationError)
      }

      const { question, answers } = httRequest.body

      await this.addSurveyUseCase.add({
        question,
        answers
      })

      return {} as any
    } catch (error: any) {
      return serverError(error.stack)
    }
  }
}

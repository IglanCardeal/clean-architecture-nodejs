import { badRequest } from '@src/presentation/helpers/http'
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
  }
}

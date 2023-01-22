import { badRequest } from '@src/presentation/helpers/http'
import { Validation } from './add-survey-protocols'
import {
  Controller,
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

    await this.addSurveyUseCase.add(httRequest.body)

    return {} as any
  }
}

import { badRequest } from '@src/presentation/helpers/http'
import { Validation } from './add-survey-protocols'
import { Controller, HttpRequest, HttpResponse } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    const validationError = this.validation.validate(httRequest.body)

    if (validationError) {
      return badRequest(validationError)
    }

    return {} as any
  }
}

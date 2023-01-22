import { Validation } from './add-survey-protocols'
import { Controller, HttpRequest, HttpResponse } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(httRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httRequest.body)
    return {} as any
  }
}

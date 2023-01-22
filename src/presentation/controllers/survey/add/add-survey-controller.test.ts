import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validation } from './add-survey-protocols'

class ValidationStub implements Validation {
  validate(_input: any): void | Error {
    return undefined
  }
}

const validationStub = new ValidationStub()

const makeSut = () => {
  return new AddSurveyController(validationStub)
}
const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any',
    answers: [
      {
        image: 'any',
        answer: 'any'
      }
    ]
  }
})

describe('Add Survey Controller', () => {
  it('Should call Valitation with correct values', async () => {
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})

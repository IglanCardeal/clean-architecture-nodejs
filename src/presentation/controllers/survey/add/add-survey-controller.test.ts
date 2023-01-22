import { badRequest } from '@src/presentation/helpers/http'
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

  it('Should return 400 if validation fails', async () => {
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(badRequest(new Error()))
  })
})

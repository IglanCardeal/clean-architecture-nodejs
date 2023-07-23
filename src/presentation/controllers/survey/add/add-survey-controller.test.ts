import {
  badRequest,
  noContent,
  serverError
} from '@src/presentation/helpers/http'
import { failure, success } from '@src/shared'
import { AddSurveyController } from './add-survey-controller'
import {
  HttpRequest,
  Validation,
  AddSurveyUseCase,
  DbAddSurveyResult
} from './add-survey-protocols'

class ValidationStub implements Validation {
  validate(_input: any): void | Error {
    return undefined
  }
}

class DbAddSurveyUseCaseStub implements AddSurveyUseCase<DbAddSurveyResult> {
  async add(_data: any): Promise<any> {
    return success({})
  }
}

const makeSut = () => {
  const validationStub = new ValidationStub()
  const dbAddSurveyUseCaseStub = new DbAddSurveyUseCaseStub()
  return {
    sut: new AddSurveyController(validationStub, dbAddSurveyUseCaseStub),
    validationStub,
    dbAddSurveyUseCaseStub
  }
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
  const { sut, validationStub, dbAddSurveyUseCaseStub } = makeSut()
  const httpRequest = makeFakeRequest()

  it('Should call Valitation with correct values', async () => {
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if validation fails', async () => {
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(badRequest(new Error()))
  })

  it('Should return 500 if Validation throws', async () => {
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call AddSurveyUseCase with correct values', async () => {
    const addSpy = jest.spyOn(dbAddSurveyUseCaseStub, 'add')
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining(httpRequest.body)
    )
  })

  it('Should return 500 if AddSurveyUseCase throws', async () => {
    jest
      .spyOn(dbAddSurveyUseCaseStub, 'add')
      .mockResolvedValueOnce(failure(new Error()))
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(serverError(new Error()))
  })

  it('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(httpRequest)
    expect(result).toEqual(noContent())
  })
})

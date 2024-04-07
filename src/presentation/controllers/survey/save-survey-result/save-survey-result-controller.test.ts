import { forbidden, ok, serverError } from '@src/presentation/helpers/http'
import {
  Body,
  SaveSurveyResultController
} from './save-survey-result-controller'
import { HttpRequest } from './save-survey-result-controller-protocols'
import { InvalidParamError } from '@src/presentation/errors'
import { mockSurveyResultModel } from '@src/shared/helpers/mocks'
import {
  LoadSurveyByIdUseCaseStub,
  SaveSurveyResultUseCaseStub
} from '@src/shared/helpers/stubs/usecase/survey'

const makeSut = () => {
  const loadSurveyByIdUseCaseStub = new LoadSurveyByIdUseCaseStub()
  const saveSurveyResultUseCaseStub = new SaveSurveyResultUseCaseStub()
  return {
    sut: new SaveSurveyResultController(
      loadSurveyByIdUseCaseStub,
      saveSurveyResultUseCaseStub
    ),
    loadSurveyByIdUseCaseStub,
    saveSurveyResultUseCaseStub
  }
}

const surveyId = 'any_survey_id'
const answer = 'any_answer'

const makeFakeRequest = (): HttpRequest<Body, never> => ({
  body: {
    surveyId,
    answer
  },
  accountId: 'any_account_id'
})

describe('SaveSurveyResultController', () => {
  it('Should call LoadSurveyByIdUseCase with correct survey id', async () => {
    const { sut, loadSurveyByIdUseCaseStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdUseCaseStub, 'loadById')

    await sut.handle(makeFakeRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId)
  })

  it('Should returns 403 if LoadSurveyByIdUseCase returns null', async () => {
    const { sut, loadSurveyByIdUseCaseStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdUseCaseStub, 'loadById')
      .mockResolvedValueOnce(null)

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(forbidden(new InvalidParamError('survey id')))
  })

  it('Should returns 500 if LoadSurveyByIdUseCase throws', async () => {
    const { sut, loadSurveyByIdUseCaseStub } = makeSut()
    const anyServerError = new Error()
    jest
      .spyOn(loadSurveyByIdUseCaseStub, 'loadById')
      .mockRejectedValueOnce(anyServerError)

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(serverError(anyServerError))
  })

  it('Should returns 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.handle({
      body: {
        answer: 'invalid_answer',
        surveyId
      }
    })

    expect(result).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call SaveSurveyResultUseCase with correct data', async () => {
    const { sut, saveSurveyResultUseCaseStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultUseCaseStub, 'save')

    await sut.handle(makeFakeRequest())

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: expect.any(Date)
    })
  })

  it('Should returns 500 if SaveSurveyResultUseCase throws', async () => {
    const { sut, saveSurveyResultUseCaseStub } = makeSut()
    const anyServerError = new Error()
    jest
      .spyOn(saveSurveyResultUseCaseStub, 'save')
      .mockRejectedValueOnce(new Error())

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(serverError(anyServerError))
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(ok(mockSurveyResultModel()))
  })
})

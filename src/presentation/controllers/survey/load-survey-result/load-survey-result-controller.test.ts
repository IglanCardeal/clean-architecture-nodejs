import { LoadSurveyResultUseCaseStub } from '@src/shared/helpers/stubs/usecase/survey'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from './load-survey-result-controller-protocols'
import { forbidden } from '@src/presentation/helpers/http'
import { InvalidParamError } from '@src/presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

const makeSut = () => {
  const loadSurveyResultUseCaseStub = new LoadSurveyResultUseCaseStub()
  const sut = new LoadSurveyResultController(loadSurveyResultUseCaseStub)
  return {
    sut,
    loadSurveyResultUseCaseStub
  }
}

describe('LoadSurveyResultController', () => {
  it('Should call LoadSurveyResultUseCase with correct value', async () => {
    const { sut, loadSurveyResultUseCaseStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultUseCaseStub, 'load')

    await sut.handle(makeFakeRequest())

    expect(loadSpy).toBeCalledWith(makeFakeRequest().params.surveyId)
  })

  it('Should return 403 if LoadSurveyResultUseCase returns null', async () => {
    const { sut, loadSurveyResultUseCaseStub } = makeSut()
    jest
      .spyOn(loadSurveyResultUseCaseStub, 'load')
      .mockResolvedValueOnce(null as any)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})

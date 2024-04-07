import { LoadSurveyResultUseCaseStub } from '@src/shared/helpers/stubs/usecase/survey'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from './load-survey-result-controller-protocols'

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
})

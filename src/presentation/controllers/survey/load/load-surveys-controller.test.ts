import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveyUseCase, SurveyModel } from './load-surveys-protocols'

class DbLoadSurveysUsecaseStub implements LoadSurveyUseCase {
  async load(): Promise<SurveyModel[]> {
    return []
  }
}

const makeSut = () => {
  const dbLoadSurveysUsecaseStub = new DbLoadSurveysUsecaseStub()
  return {
    sut: new LoadSurveysController(dbLoadSurveysUsecaseStub),
    dbLoadSurveysUsecaseStub
  }
}

describe('LoadSurveysController', () => {
  const { sut, dbLoadSurveysUsecaseStub } = makeSut()

  it('Should call LoadSurveysUseCase', async () => {
    const loadSpy = jest.spyOn(dbLoadSurveysUsecaseStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})

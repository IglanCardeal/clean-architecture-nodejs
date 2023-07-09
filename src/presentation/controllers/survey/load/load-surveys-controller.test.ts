import { ok } from '@src/presentation/helpers/http'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveyUseCase, SurveyModel } from './load-surveys-protocols'

const anyDate = new Date()
const makeFakeSurveys = (): SurveyModel[] => [{
  answers: [
    {
      answer: 'any',
      image: 'any'
    }
  ],
  date: anyDate,
  question: 'any'
}]

class DbLoadSurveysUsecaseStub implements LoadSurveyUseCase {
  async load(): Promise<SurveyModel[]> {
    return makeFakeSurveys()
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

  it('Should return surveys data on success', async () => {
    const result = await sut.handle({})
    expect(result).toEqual(ok(makeFakeSurveys()))
  })
})

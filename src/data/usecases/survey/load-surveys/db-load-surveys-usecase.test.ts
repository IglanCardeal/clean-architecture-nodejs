import { DbLoadSurveysUseCase } from './db-load-surveys-usecase'
import {
  ListSurveysRepository,
  SurveyModel
} from './db-load-surveys-usecase-protocols'

const makeFakeSurveys = (): SurveyModel[] => [
  {
    answers: [
      {
        answer: 'any',
        image: 'any'
      }
    ],
    date: new Date(),
    question: 'any'
  }
]

class LoadSurveysRepositoryStub implements ListSurveysRepository {
  async getList(): Promise<SurveyModel[]> {
    return makeFakeSurveys()
  }
}

const makeSut = () => {
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
  return {
    sut: new DbLoadSurveysUseCase(loadSurveysRepositoryStub),
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveysUseCase', () => {
  it('should call LoadSurveysRepository', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    const listSpy = jest.spyOn(loadSurveysRepositoryStub, 'getList')

    await sut.load()

    expect(listSpy).toHaveBeenCalled()
  })
})

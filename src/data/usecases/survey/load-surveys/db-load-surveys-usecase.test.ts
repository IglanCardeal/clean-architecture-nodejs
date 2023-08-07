import { mockSurveys } from '@src/shared/helpers/mocks'
import { DbLoadSurveysUseCase } from './db-load-surveys-usecase'
import {
  ListSurveysRepository,
  SurveyModel
} from './db-load-surveys-usecase-protocols'

class LoadSurveysRepositoryStub implements ListSurveysRepository {
  async getList(): Promise<SurveyModel[]> {
    return mockSurveys()
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

  it('should return a list of surveys on success', async () => {
    const { sut } = makeSut()

    const result = await sut.load()

    expect(result).toEqual(mockSurveys())
  })

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveysRepositoryStub, 'getList')
      .mockRejectedValueOnce(new Error())

    const promise = sut.load()

    await expect(promise).rejects.toThrow()
  })
})

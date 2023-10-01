import { mockSurveyModel } from '@src/shared/helpers/mocks'
import { DbLoadSurveyByIdUseCase } from './db-load-survey-by-id-usecase'
import { mockLoadSurveyByIdRepository } from '@src/shared/helpers/stubs/db/survey'

const makeSut = () => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  return {
    sut: new DbLoadSurveyByIdUseCase(loadSurveyByIdRepositoryStub),
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyByIdUseCase', () => {
  const surveyId = 'any_id'

  it('Should call LoadSurveyByIdRepository with correct survey id', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'load')

    await sut.loadById(surveyId)

    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return survey data on success', async () => {
    const { sut } = makeSut()

    const result = await sut.loadById(surveyId)

    expect(result).toEqual(mockSurveyModel())
  })

  it('Should return null if no survey was found', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'load').mockResolvedValueOnce(null)

    const result = await sut.loadById(surveyId)

    expect(result).toEqual(null)
  })

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'load')
      .mockRejectedValueOnce(new Error())

    await expect(sut.loadById(surveyId)).rejects.toThrow()
  })
})

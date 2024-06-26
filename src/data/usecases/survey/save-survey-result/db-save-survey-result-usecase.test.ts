import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel
} from '@src/shared/helpers/mocks'
import { DbSaveSurveyResultUseCase } from './db-save-survey-result-usecase'
import {
  mockLoadSurveyResultRepository,
  mockSaveSurveyResultRepository
} from '@src/shared/helpers/stubs/db/survey'

const makeSut = () => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  return {
    sut: new DbSaveSurveyResultUseCase(
      saveSurveyResultRepositoryStub,
      loadSurveyResultRepositoryStub
    ),
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResultUseCase', () => {
  it('Should call SaveSurveyResultRepository with correct survey data', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    await sut.save(mockSaveSurveyResultParams())

    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  it('Should call LoadSurveyResultRepository with correct survey result id', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )

    await sut.save(mockSaveSurveyResultParams())

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
      mockSaveSurveyResultParams().surveyId
    )
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockRejectedValueOnce(new Error())

    await expect(sut.save(mockSaveSurveyResultParams())).rejects.toThrow()
  })

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())

    await expect(sut.save(mockSaveSurveyResultParams())).rejects.toThrow()
  })

  it('Should return survey result data on success', async () => {
    const { sut } = makeSut()

    const result = await sut.save(mockSaveSurveyResultParams())

    expect(result).toEqual(mockSurveyResultModel())
  })
})

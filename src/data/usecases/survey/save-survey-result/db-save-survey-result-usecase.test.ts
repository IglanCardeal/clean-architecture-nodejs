import { mockSaveSurveyResultModel } from '@src/shared/helpers/mocks'
import { DbSaveSurveyResultUseCase } from './db-save-survey-result-usecase'
import { mockSaveSurveyResultRepository } from '@src/shared/helpers/stubs/db/survey'

const makeSut = () => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  return {
    sut: new DbSaveSurveyResultUseCase(saveSurveyResultRepositoryStub),
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResultUseCase', () => {
  it('Should call SaveSurveyResultRepository with correct survey data', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    await sut.save(mockSaveSurveyResultModel())

    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultModel())
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockRejectedValueOnce(new Error())

    await expect(sut.save(mockSaveSurveyResultModel())).rejects.toThrow()
  })

  it('Should return survey result data on success', async () => {
    const { sut } = makeSut()

    const result = await sut.save(mockSaveSurveyResultModel())

    expect(result).toEqual({ ...mockSaveSurveyResultModel(), id: 'any_id' })
  })
})

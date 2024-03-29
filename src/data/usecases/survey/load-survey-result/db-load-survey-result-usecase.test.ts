import { mockLoadSurveyResultRepository } from '@src/shared/helpers/stubs/db/survey'
import { DbLoadSurveyResultUseCase } from './db-load-survey-result-usecase'
import { mockSurveyResultModel } from '@src/shared/helpers/mocks'

const makeSut = () => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResultUseCase(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResultUseCase', () => {
  const anySurveyResultId = 'any_survey_result_id'

  it('should call LoadSurveyResultRepository with correct survey result id', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )

    await sut.load(anySurveyResultId)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(anySurveyResultId)
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())

    await expect(sut.load(anySurveyResultId)).rejects.toThrow()
  })

  it('should return survey result on success', async () => {
    const { sut } = makeSut()

    const result = await sut.load(anySurveyResultId)

    expect(result).toEqual(mockSurveyResultModel())
  })
})

import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyResultRepository
} from '@src/shared/helpers/stubs/db/survey'
import { DbLoadSurveyResultUseCase } from './db-load-survey-result-usecase'
import { mockSurveyResultModel } from '@src/shared/helpers/mocks'

const makeSut = () => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepository = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResultUseCase(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepository
  )
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepository
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

  it('should call LoadSurveyByIdRepository when LoadSurveyResultRepository returns null', async () => {
    const { loadSurveyResultRepositoryStub, loadSurveyByIdRepository, sut } =
      makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockResolvedValueOnce(null as any)
    const loadSpy = jest.spyOn(loadSurveyByIdRepository, 'load')

    await sut.load(anySurveyResultId)

    expect(loadSpy).toHaveBeenCalledWith(anySurveyResultId)
  })

  it('should return null when LoadSurveyByIdRepository returns null', async () => {
    const { loadSurveyResultRepositoryStub, loadSurveyByIdRepository, sut } =
      makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockResolvedValueOnce(null as any)
    jest
      .spyOn(loadSurveyByIdRepository, 'load')
      .mockResolvedValueOnce(null as any)

    const result = await sut.load(anySurveyResultId)

    expect(result).toBeNull()
  })

  it.skip('should return survey result on success', async () => {
    const { sut } = makeSut()

    const result = await sut.load(anySurveyResultId)

    expect(result).toEqual(mockSurveyResultModel())
  })
})

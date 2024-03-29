import { mockLoadSurveyResultRepository } from '@src/shared/helpers/stubs/db/survey'
import { DbLoadSurveyResultUseCase } from './db-load-survey-result-usecase'

const makeSut = () => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResultUseCase(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResultUseCase', () => {
  it('should call LoadSurveyResultRepository with correct survey result id', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )
    const anySurveyResultId = 'any_survey_result_id'

    await sut.load(anySurveyResultId)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(anySurveyResultId)
  })
})

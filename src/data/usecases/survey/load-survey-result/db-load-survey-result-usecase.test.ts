import { SurveyResultModel } from '../save-survey-result/db-save-survey-result-usecase-protocols'
import { mockSurveyResultModel } from '@src/shared/helpers/mocks'
import { DbLoadSurveyResultUseCase } from './db-load-survey-result-usecase'
import { LoadSurveyResultRepository } from '@src/data/protocols/db'

const mockLoadSurveyResultRepository = () => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(_surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

describe('DbLoadSurveyResultUseCase', () => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()

  it('should call LoadSurveyResultRepository with correct survey result id', async () => {
    const sut = new DbLoadSurveyResultUseCase(loadSurveyResultRepositoryStub)
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )
    const anySurveyResultId = 'any_survey_result_id'

    await sut.load(anySurveyResultId)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(anySurveyResultId)
  })
})

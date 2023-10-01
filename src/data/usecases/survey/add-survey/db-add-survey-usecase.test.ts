import { AddSurveyRepositoryError } from './db-add-survey-usecase-result'
import { DbAddSurveyUseCase } from './db-add-survey-usecase'
import { mockSurveyData } from '@src/shared/helpers/mocks'
import { mockAddSurveyRepository } from '@src/shared/helpers/stubs/db/survey'

const makeSut = () => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  return {
    sut: new DbAddSurveyUseCase(addSurveyRepositoryStub),
    addSurveyRepositoryStub
  }
}

describe('DbAddSurveyUseCase', () => {
  const surveyData = mockSurveyData()
  const { addSurveyRepositoryStub, sut } = makeSut()

  it('should call AddSurveyRepository with correct values', async () => {
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  it('should return a AddSurveyRepositoryError if AddSurveyRepository throws', async () => {
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error())
    const result = await sut.add(surveyData)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new AddSurveyRepositoryError())
  })
})

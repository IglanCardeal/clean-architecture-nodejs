import {
  AddSurveyRepository,
  SurveyModel
} from './db-add-survey-usecase-protocols'
import { AddSurveyRepositoryError } from './db-add-survey-usecase-result'
import { DbAddSurveyUseCase } from './db-add-survey-usecase'

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add(_survey: SurveyModel): Promise<void> {
    return undefined
  }
}

const makeSut = () => {
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
  return {
    sut: new DbAddSurveyUseCase(addSurveyRepositoryStub),
    addSurveyRepositoryStub
  }
}

const makeFakeSurveyData = () => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

describe('DbAddSurveyUseCase', () => {
  const surveyData = makeFakeSurveyData()
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

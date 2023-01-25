import { AddSurveyModel } from '@src/domain/usecases/add-survey'
import { AddSurveyRepository } from './db-add-survey-usecase-protocols'
import { DbAddSurveyUseCase } from './db-add-survey-usecase.'

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add(_survey: AddSurveyModel): Promise<void> {
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
  ]
})

describe('DbAddSurveyUseCase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { addSurveyRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
